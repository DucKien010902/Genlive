const Creator = require('../model/Talents');
class CreatorController {
  // 🧾 Lấy danh sách tất cả creators
  async getAll(req, res) {
    try {
      console.log('here');
      const creators = await Creator.find();
      res.status(200).json(creators);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy dữ liệu', error });
    }
  }

  // 🔍 Lấy theo ID
  async getById(req, res) {
    try {
      const creator = await Creator.findById(req.params.id);
      if (!creator)
        return res.status(404).json({ message: 'Không tìm thấy creator' });
      res.status(200).json(creator);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy chi tiết', error });
    }
  }

  // ➕ Thêm mới
  async create(req, res) {
    try {
      const newCreator = new Creator(req.body);
      await newCreator.save();
      res.status(201).json(newCreator);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi thêm creator', error });
    }
  }

  // 🧩 Cập nhật
  async update(req, res) {
    try {
      const updated = await Creator.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy creator' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi cập nhật', error });
    }
  }

  // ❌ Xóa
  async delete(req, res) {
    try {
      const deleted = await Creator.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: 'Không tìm thấy creator' });
      res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi xóa', error });
    }
  }
}

module.exports = new CreatorController();
