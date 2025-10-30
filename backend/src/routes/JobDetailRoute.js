const express = require('express');
const route = express.Router();
// Sửa tên import cho đúng controller
const JobDetailController = require('../app/controllers/JobdetailController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /jobdetail/seed (Đưa route seed lên trước)
route.post('/seed', JobDetailController.seedJobDetail);

// GET /jobdetail/:jobID (Sửa route cho chuẩn RESTful)
// Component sẽ gọi /api/jobdetail/123
route.get('/:jobID', JobDetailController.getDetail);

// PUT /jobdetail/:jobID (Route mới để cập nhật)
// Component sẽ gọi /api/jobdetail/123 với method PUT
route.put('/:jobID', /* authMiddleware, */ JobDetailController.updateDetail);

// Route cũ (đã được thay thế bằng route mới ở trên)
// route.get('/getjobdetail', JobsController.getDetail);

module.exports = route;
