const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    jobID: { type: Number, require: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['Toàn thời gian', 'Bán thời gian', 'Khác'],
      required: true,
    },
    location: { type: String, required: true },
    deadline: { type: String, required: true },
    salary: { type: String, required: true },
    isNegotiable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema, 'Jobs');
