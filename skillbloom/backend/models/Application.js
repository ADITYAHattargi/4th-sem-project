const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  coverLetter: {
    type: String,
    maxlength: [500, 'Cover letter too long']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  // Business response
  businessNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for queries
applicationSchema.index({ post: 1, student: 1 }, { unique: true });
applicationSchema.index({ post: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);

