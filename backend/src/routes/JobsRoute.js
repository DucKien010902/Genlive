const express = require('express');
const route = express.Router();
const JobsController = require('../app/controllers/JobsController');
// const authMiddleware = require('../middlewares/authMiddleware'); // Bạn có thể bật lại nếu cần xác thực

// Định tuyến theo chuẩn RESTful

// POST /jobs/seed - (Đặt trước /jobs/:id để tránh nhầm lẫn)
route.post('/seed', JobsController.seedJobs);

// GET /jobs - Lấy tất cả jobs
route.get('/', JobsController.getJobs);

// POST /jobs - Tạo job mới
route.post('/', /* authMiddleware, */ JobsController.createJob);

// GET /jobs/:id - Lấy chi tiết 1 job
route.get('/:id', JobsController.getJobById);

// PUT /jobs/:id - Cập nhật job
route.put('/:id', /* authMiddleware, */ JobsController.updateJob);

// DELETE /jobs/:id - Xóa job
route.delete('/:id', /* authMiddleware, */ JobsController.deleteJob);

// Route cũ của bạn (Nếu bạn vẫn muốn giữ)
// route.get('/getalljobs', JobsController.getJobs);

module.exports = route;
