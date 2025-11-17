// models/TalentGroup.js
const mongoose = require("mongoose");

const TalentGroupSchema = new mongoose.Schema({
  id:{ type: Number, required: true, unique: true },
  name: { type: String, required: true },
  handle: { type: String, required: true },
  followers: { type: String },
  category: { type: String },
  imageUrl: { type: String },
  description: { type: String },
}, {
  timestamps: true // tự động tạo createdAt, updatedAt
});

module.exports = mongoose.model("TalentGroup", TalentGroupSchema,"TalentGroup");
