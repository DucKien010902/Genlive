const Creator = require('../model/talents');

class TalentsController {
  // 🧾 Lấy danh sách tất cả talents
  async getAll(req, res) {
    try {
      const talents = await Creator.find().sort({ createdAt: -1 });
      res.status(200).json(talents);
    } catch (error) {
      console.error('❌ getAll error:', error);
      res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error });
    }
  }

  // 🔍 Lấy theo ID
  async getById(req, res) {
    try {
      const talent = await Creator.findById(req.params.id);
      if (!talent)
        return res.status(404).json({ message: 'Không tìm thấy talent' });
      res.status(200).json(talent);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy chi tiết', error });
    }
  }

  // ➕ Thêm mới
  async create(req, res) {
    try {
      const newTalent = new Creator(req.body);
      await newTalent.save();
      res.status(201).json(newTalent);
    } catch (error) {
      console.error('❌ create error:', error);
      res.status(400).json({ message: 'Lỗi khi thêm talent', error });
    }
  }

  // 🧩 Cập nhật
  async update(req, res) {
    try {
      const updated = await Creator.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy talent' });
      res.status(200).json(updated);
    } catch (error) {
      console.error('❌ update error:', error);
      res.status(400).json({ message: 'Lỗi khi cập nhật', error });
    }
  }

  // ❌ Xóa 1 talent
  async delete(req, res) {
    try {
      const deleted = await Creator.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: 'Không tìm thấy talent' });
      res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
      console.error('❌ delete error:', error);
      res.status(400).json({ message: 'Lỗi khi xóa', error });
    }
  }

  // 🗑️ Xóa nhiều talent
  async deleteMany(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Danh sách ID không hợp lệ' });
      }

      const result = await Creator.deleteMany({ _id: { $in: ids } });
      res.status(200).json({
        message: `Đã xóa ${result.deletedCount} talents`,
      });
    } catch (error) {
      console.error('❌ deleteMany error:', error);
      res.status(400).json({ message: 'Lỗi khi xóa hàng loạt', error });
    }
  }
}

module.exports = new TalentsController();
