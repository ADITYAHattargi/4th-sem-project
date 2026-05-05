const express = require('express');
const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const multer = require('multer');
const router = express.Router();

const execFileAsync = promisify(execFile);
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXTENSIONS_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPG, PNG, WEBP, or GIF images are allowed'));
      return;
    }

    cb(null, true);
  }
});

function runUpload(req, res, next) {
  upload.single('photo')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({ error: 'Image must be 10 MB or smaller' });
      return;
    }

    res.status(400).json({ error: error.message || 'Invalid image upload' });
  });
}

function getR2Config() {
  const bucket = process.env.CLOUDFLARE_R2_BUCKET;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  if (!bucket || !publicUrl) return null;

  return {
    bucket,
    publicUrl: publicUrl.replace(/\/$/, '')
  };
}

function buildObjectKey(file) {
  const extension = EXTENSIONS_BY_TYPE[file.mimetype] || 'bin';
  return `profile-photos/${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

async function uploadToR2WithWrangler(file) {
  const config = getR2Config();
  if (!config) return null;

  const objectKey = buildObjectKey(file);
  const tempFile = path.join(os.tmpdir(), objectKey.replace(/\//g, '-'));

  await fs.writeFile(tempFile, file.buffer);

  try {
    await execFileAsync(
      'wrangler',
      [
        'r2',
        'object',
        'put',
        `${config.bucket}/${objectKey}`,
        '--file',
        tempFile,
        '--content-type',
        file.mimetype,
        '--remote'
      ],
      { timeout: 120000 }
    );
  } finally {
    await fs.unlink(tempFile).catch(() => {});
  }

  return {
    photoUrl: `${config.publicUrl}/${objectKey}`,
    objectKey,
    bucket: config.bucket,
    provider: 'cloudflare-r2'
  };
}

function getCloudflareImagesConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_IMAGES_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
  const email = process.env.CLOUDFLARE_API_EMAIL;
  const globalApiKey = process.env.CLOUDFLARE_GLOBAL_API_KEY;

  if (!accountId || (!token && (!email || !globalApiKey))) return null;

  return {
    accountId,
    token,
    email,
    globalApiKey,
    variant: process.env.CLOUDFLARE_IMAGES_VARIANT || 'public'
  };
}

function buildCloudflareAuthHeaders(config) {
  if (config.token) {
    return { Authorization: `Bearer ${config.token}` };
  }

  return {
    'X-Auth-Email': config.email,
    'X-Auth-Key': config.globalApiKey
  };
}

function pickCloudflareVariant(variants, preferredVariant) {
  if (!Array.isArray(variants) || variants.length === 0) return '';
  return variants.find(url => url.endsWith(`/${preferredVariant}`)) || variants[0];
}

async function uploadToCloudflareImages(file) {
  const config = getCloudflareImagesConfig();
  if (!config) return null;

  const formData = new FormData();
  const imageBlob = new Blob([file.buffer], { type: file.mimetype });

  formData.append('file', imageBlob, file.originalname || `skillbloom-profile-${Date.now()}`);
  formData.append('requireSignedURLs', 'false');

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`,
    {
      method: 'POST',
      headers: buildCloudflareAuthHeaders(config),
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    const message = data.errors?.[0]?.message || 'Cloudflare image upload failed';
    throw new Error(`Cloudflare upload failed: ${message}`);
  }

  const variants = data.result?.variants || [];
  const photoUrl = pickCloudflareVariant(variants, config.variant);

  if (!photoUrl) {
    throw new Error('Cloudflare did not return an image URL');
  }

  return {
    photoUrl,
    imageId: data.result.id,
    variants,
    provider: 'cloudflare-images'
  };
}

router.post('/', runUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const r2Upload = await uploadToR2WithWrangler(req.file);
    if (r2Upload) {
      return res.json(r2Upload);
    }

    const cloudflareUpload = await uploadToCloudflareImages(req.file);
    if (cloudflareUpload) {
      return res.json(cloudflareUpload);
    }

    const photoUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    res.json({ photoUrl, provider: 'local-data-url' });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(502).json({ error: error.message || 'Server upload error' });
  }
});

module.exports = router;
