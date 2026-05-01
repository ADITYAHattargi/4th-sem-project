const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [1000, 'Caption too long']
  },
  media: {
    type: String, // Cloudinary URL
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  highlight: {
    type: String,
    maxlength: 100
  },
  // Business hiring info
  jobTitle: String,
  requirements: [String],
  payRange: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user population
postSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id'
});

postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);

