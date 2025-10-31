// models/Article.js
const mongoose = require('mongoose');

const contentBlockSchema = new mongoose.Schema({
  type: { type: String, required: true },
  level: { type: Number },
  style: { type: String },
  text: { type: String },
  items: [{ type: String }],
});

const articleSchema = new mongoose.Schema(
  {
    blogID: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String },
    publishedAt: { type: Date, required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    content: [contentBlockSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Article', articleSchema, 'Articles');
