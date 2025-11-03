// controllers/articleController.js
const Article = require('../model/Articles');

// Lấy danh sách bài viết
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết 1 bài viết theo slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // new: true -> Trả về tài liệu sau khi đã cập nhật // runValidators: true -> Đảm bảo dữ liệu mới tuân thủ Mongoose Schema
    const updatedArticle = await Article.findOneAndUpdate(
      { slug: slug }, // Điều kiện tìm
      req.body, // Dữ liệu mới
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Tạo bài viết mới
exports.createArticle = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa bài viết
exports.deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Article not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
