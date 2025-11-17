const express = require("express");
const router = express.Router();
const TalentGroupController = require("../app/controllers/TalentGroupController");

// Lấy tất cả
router.get("/", (req, res) => TalentGroupController.getAll(req, res));

// Lấy 1 theo id
router.get("/:id", (req, res) => TalentGroupController.getById(req, res));

// Tạo mới
router.post("/", (req, res) => TalentGroupController.create(req, res));

// Cập nhật theo id
router.put("/:id", (req, res) => TalentGroupController.updateById(req, res));

// Xóa theo id
router.delete("/:id", (req, res) => TalentGroupController.deleteById(req, res));

module.exports = router;
