const express = require('express');
const route = express.Router();
const TalentsController = require('../app/controllers/talentsController');

// 📜 Routes
route.get('/', TalentsController.getAll);
route.get('/:id', TalentsController.getById);
route.post('/', TalentsController.create);
route.put('/:id', TalentsController.update);
route.delete('/:id', TalentsController.delete);

// ✅ Xóa nhiều talents cùng lúc (client gửi body: { ids: [...] })
route.delete('/', TalentsController.deleteMany);

module.exports = route;
