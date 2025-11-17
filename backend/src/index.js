// server.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const path = require('path');
const app = express();
const server = http.createServer(app);

// ✅ Danh sách origin được phép
const allowedOrigins = [
  'https://genlive.vn',
  'https://www.genlive.vn',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

// ✅ Cấu hình CORS đúng cách
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// ✅ Kết nối DB
const db = require('./config/db/index');
db.connect();

// ✅ Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Routes
const route = require('./routes/index');
route(app);

// ✅ Chạy server
server.listen(5001, '0.0.0.0', () => {
  console.log('🚀 Server running on http://localhost:5001');
});
