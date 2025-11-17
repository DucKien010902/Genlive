const TalentGroup = require("../model/talentGroups");

class TalentGroupController {
  // Lấy tất cả talent groups
  async getAll(req, res) {
    try {
      const talentGroups = await TalentGroup.find().sort({ createdAt: -1 });
      res.json(talentGroups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Lấy 1 talent group theo id
  async getById(req, res) {
    try {
      const talentGroup = await TalentGroup.findOne({ id: req.params.id });
      if (!talentGroup) return res.status(404).json({ message: "TalentGroup not found" });
      res.json(talentGroup);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Tạo mới talent group
  async create(req, res) {
    try {
      const newTalentGroup = new TalentGroup(req.body);
      await newTalentGroup.save();
      res.status(201).json(newTalentGroup);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Cập nhật talent group theo id
  async updateById(req, res) {
    try {
      const updated = await TalentGroup.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ message: "TalentGroup not found" });
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Xóa talent group theo id
  async deleteById(req, res) {
    try {
      const deleted = await TalentGroup.findOneAndDelete({ id: req.params.id });
      if (!deleted) return res.status(404).json({ message: "TalentGroup not found" });
      res.json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TalentGroupController();
