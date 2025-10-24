const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema(
  {
    ID: { type: Number, required: true },
    name: { type: String, required: true },
    handle: { type: String, required: true },
    followers: { type: String, default: 'N/A' },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Talents', creatorSchema, 'Talents');
