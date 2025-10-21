const Job = require('../model/JobDB');

class JobController {
  // Lấy danh sách job
  async getJobs(req, res) {
    try {
      const jobs = await Job.find();
      return res.status(200).json(jobs);
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi server', error: err });
    }
  }

  // Seed dữ liệu vào DB
  async seedJobs(req, res) {
    try {
      const data = req.body; // Nhận array mockJobs
      await Job.insertMany(data);
      return res.status(201).json({ message: '✅ Seed dữ liệu thành công!' });
    } catch (err) {
      return res.status(500).json({ message: '❌ Seed thất bại', error: err });
    }
  }
}

module.exports = new JobController();
