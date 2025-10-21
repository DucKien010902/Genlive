const express = require('express');
const route = express.Router();
const JobsController = require('../app/controllers/JobsController');
const authMiddleware = require('../middlewares/authMiddleware');
route.get('/getalljobs', JobsController.getJobs);
module.exports = route;
