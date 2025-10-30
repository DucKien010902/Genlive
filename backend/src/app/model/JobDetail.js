const mongoose = require('mongoose');

const jobDetailSchema = new mongoose.Schema({
  jobID: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  meta: [
    {
      icon: { type: String },
      text: { type: String },
    },
  ],
  info: {
    salary: { type: String },
    bonus: { type: String },
    classify: { type: String },
    timework: { type: String },
    place: { type: String },
  },
  descriptionTitle: { type: String },
  description: [{ type: String }],
  requirementsTitle: { type: String },
  requirements: [{ type: String }],
  benefitsTitle: { type: String },
  benefits: [{ type: String }],
  referenceTitle: { type: String },
  references: [
    {
      label: { type: String },
      url: { type: String },
      linkText: { type: String },
    },
  ],
  contactTitle: { type: String },
  contact: {
    person: { type: String },
    email: { type: String },
    mobile: { type: String },
    phone: { type: String },
  },
});

module.exports = mongoose.model('JobDetail', jobDetailSchema, 'Jobdetails');
