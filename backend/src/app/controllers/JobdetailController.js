const JobDetail = require('../model/JobDetail');

class JobDetailController {
  // GET /jobs/detail/:jobID
  async getDetail(req, res) {
    try {
      const { jobID } = req.query;
      console.log(jobID);
      const job = await JobDetail.findOne({ jobID: jobID });

      if (!job) {
        return res.status(404).json({ message: 'Không tìm thấy job này' });
      }

      return res.status(200).json(job);
    } catch (error) {
      return res.status(500).json({ message: 'Lỗi server', error });
    }
  }

  // POST /jobs/seedDetail
  async seedJobDetail(req, res) {
    try {
      const data = req.body; // Nhận 1 object jobDetail như bạn gửi ở trên
      await JobDetail.create(data);
      return res
        .status(201)
        .json({ message: '✅ Seed job detail thành công!' });
    } catch (error) {
      return res.status(500).json({ message: '❌ Seed thất bại', error });
    }
  }
}

module.exports = new JobDetailController();
