const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
    default: 'Full-time'
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  applicationDeadline: [{
    type: Date,
    default: Date.now
  }],
  postedBefore: {
    type: Boolean,
    required: true
  },
  coordinates: {
      type: String,
      required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Job', JobSchema);
