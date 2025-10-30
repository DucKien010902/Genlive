const Job = require('../model/JobDB');

class JobController {
  // [GET] /jobs - Lấy danh sách tất cả job
  async getJobs(req, res) {
    try {
      // Sắp xếp job mới nhất lên đầu
      const jobs = await Job.find().sort({ createdAt: -1 });
      return res.status(200).json(jobs);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Lỗi server', error: err.message });
    }
  }

  // [GET] /jobs/:id - Lấy chi tiết 1 job
  async getJobById(req, res) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
      }
      return res.status(200).json(job);
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Lỗi server', error: err.message });
    }
  }

  // [POST] /jobs - Tạo job mới
  async createJob(req, res) {
    try {
      // TODO: Thêm logic tự động tạo jobID nếu cần, ví dụ:
      // const lastJob = await Job.findOne().sort({ jobID: -1 });
      // const newJobID = lastJob ? lastJob.jobID + 1 : 1;
      // const newJobData = { ...req.body, jobID: newJobID };

      // Đơn giản là lấy dữ liệu từ body
      const newJob = new Job(req.body);
      await newJob.save();
      return res
        .status(201)
        .json({ message: 'Tạo công việc thành công', job: newJob });
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'Tạo thất bại', error: err.message });
    }
  }

  // [PUT] /jobs/:id - Cập nhật job
  async updateJob(req, res) {
    try {
      const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Trả về document đã được cập nhật
        runValidators: true, // Chạy validate của Schema
      });

      if (!updatedJob) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
      }

      return res
        .status(200)
        .json({ message: 'Cập nhật thành công', job: updatedJob });
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'Cập nhật thất bại', error: err.message });
    }
  }

  // [DELETE] /jobs/:id - Xóa job
  async deleteJob(req, res) {
    try {
      const deletedJob = await Job.findByIdAndDelete(req.params.id);

      if (!deletedJob) {
        return res.status(404).json({ message: 'Không tìm thấy công việc' });
      }

      return res.status(200).json({ message: 'Xóa công việc thành công' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Lỗi server', error: err.message });
    }
  }

  // [POST] /jobs/seed - Seed dữ liệu (Giữ lại để test)
  async seedJobs(req, res) {
    try {
      const data = req.body; // Nhận array mockJobs
      await Job.deleteMany({}); // Xóa dữ liệu cũ (Tùy chọn)
      await Job.insertMany(data);
      return res.status(201).json({ message: '✅ Seed dữ liệu thành công!' });
    } catch (err) {
      return res
        .status(500)
        .json({ message: '❌ Seed thất bại', error: err.message });
    }
  }
}

module.exports = new JobController();
