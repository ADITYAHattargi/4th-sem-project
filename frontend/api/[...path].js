export default async function handler(req, res) {
  const apiBaseUrl = process.env.SKILLBLOOM_API_BASE_URL;

  if (!apiBaseUrl) {
    res.status(500).json({ error: 'SKILLBLOOM_API_BASE_URL is not configured' });
    return;
  }

  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : '';
  const targetUrl = `${apiBaseUrl.replace(/\/$/, '')}/api/${path}`;
  const headers = { ...req.headers };

  delete headers.host;
  delete headers['x-forwarded-host'];

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method || '') ? undefined : req,
      duplex: 'half'
    });

    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const body = Buffer.from(await upstream.arrayBuffer());
    res.send(body);
  } catch (error) {
    res.status(502).json({ error: 'Backend proxy failed' });
  }
}
