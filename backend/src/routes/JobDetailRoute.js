const express = require('express');
const route = express.Router();
const JobsController = require('../app/controllers/JobdetailController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getjobdetail', JobsController.getDetail);
module.exports = route;
