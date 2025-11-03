const express = require('express');
const router = express.Router();
const articleController = require('../app/controllers/articleController');
// ⚠️ Đảm bảo đúng đường dẫn: nếu bạn để file trong `app/controllers` thì sửa lại như sau:
// const articleController = require('../app/controllers/articleController');

// ===============================
// 📜 ARTICLE ROUTES
// ===============================

// Lấy danh sách bài viết
router.get('/', articleController.getArticles);

// Lấy chi tiết bài viết theo slug
router.get('/:slug', articleController.getArticleBySlug);

// Tạo bài viết mới
router.post('/', articleController.createArticle);

// Xóa bài viết theo ID
router.delete('/:id', articleController.deleteArticle);
router.put('/:slug', articleController.updateArticleBySlug);

module.exports = router;
