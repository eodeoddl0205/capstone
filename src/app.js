require('dotenv').config();
const mongoDB = require('./config/mongoDB');
const express = require('express');
const expressSanitizer = require("express-sanitizer");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const cameraRoutes = require('./routes/cameraRoutes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(expressSanitizer());
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin : 'https://skoollen.kro.kr',
  credentials: true, // 쿠키를 포함한 요청을 허용
}));

app.use('/api/auth', authRoutes);
app.use('/api/camera', cameraRoutes);

const options = {
  key: fs.readFileSync('./src/config/key.pem'),
  cert: fs.readFileSync('./src/config/cert.pem'),
  rejectUnauthorized: false
};

https.createServer(options, app).listen(8000, () => {
  console.log('HTTPS server running on port 8000');
});