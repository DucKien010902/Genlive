const JobDetail = require('../model/JobDetail');

class JobDetailController {
  // GET /jobdetail/:jobID
  async getDetail(req, res) {
    try {
      // Lấy jobID từ params (thay vì query) để đúng chuẩn RESTful
      const { jobID } = req.params;

      const job = await JobDetail.findOne({ jobID: jobID });

      if (!job) {
        return res.status(404).json({ message: 'Không tìm thấy job này' });
      }

      return res.status(200).json(job);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Lỗi server', error: error.message });
    }
  }

  // PUT /jobdetail/:jobID - HÀM MỚI ĐỂ CẬP NHẬT
  async updateDetail(req, res) {
    try {
      const { jobID } = req.params;
      const updateData = req.body;

      const updatedJob = await JobDetail.findOneAndUpdate(
        { jobID: jobID }, // Điều kiện tìm
        updateData, // Dữ liệu mới
        { new: true, runValidators: true } // Trả về document đã cập nhật và chạy validate
      );

      if (!updatedJob) {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy job này để cập nhật' });
      }

      return res
        .status(200)
        .json({ message: 'Cập nhật thành công!', job: updatedJob });
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'Cập nhật thất bại', error: error.message });
    }
  }

  // POST /jobdetail/seed - (Giữ lại hàm seed)
  async seedJobDetail(req, res) {
    try {
      const data = req.body;
      // Thêm logic xóa cũ để tránh trùng lặp khi seed nhiều lần
      await JobDetail.deleteOne({ jobID: data.jobID });
      await JobDetail.create(data);
      return res
        .status(201)
        .json({ message: '✅ Seed job detail thành công!' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: '❌ Seed thất bại', error: error.message });
    }
  }
}

module.exports = new JobDetailController();
