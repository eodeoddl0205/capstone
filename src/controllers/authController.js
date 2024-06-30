require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('../config/mysql');
const redisClient = require('../config/redisClient');
const validator = require('validator');
const mail = require('../config/mailer');

//JWT에 쓰일 secrekey
const secretkey = "742E2B6B1BB316C73899A553E312B";

//회원가입
exports.signup = async (req, res) => {
  try {
    //받은 데이터 변수로 변환
    const userData = req.body;
    const password = userData.password;
    const email = userData.email;
    const username = "user" + Math.floor(Math.random() * 9999 + 1);

    //비밀번호를 헤쉬로 변경
    const hashedPassword = await bcrypt.hash(password, 8);

    //입려값이 정상적인지 확인
    if (!validator.isEmail(email) || validator.isEmpty(password)) {
      return res.status(400).send({ message: 'There is an incorrectly entered value' });
    }

    //mysql에 정보 추가
    await mysql.execute('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [email, hashedPassword, username]);

    //성공 메세지 보내기
    res.status(201).send({ message: 'User Login Successfully' });
  } catch (error) {
    //에러 메세지 보내기
    console.log(error);
    res.status(500).send({ message: 'Error signup user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    //받은 값 변수로 변환
    const userData = req.body;
    const email = userData.email;
    const password = userData.password;

    //이메일로 유저가 있는지 확인(기본키이기에 겹치는 일 없음)
    const [rows] = await mysql.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found' });
    }

    //비밀번호가 맞는지 확인
    const storedPassword = rows[0].password;
    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid password' });
    }

    const inAccessUserData = {
      id: rows[0].id,
    }

    const inRefreshUserData = {
      id: rows[0].id,
      username: rows[0].username,
    }

    const accessToken = jwt.sign(inAccessUserData, secretkey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(inRefreshUserData, secretkey, { expiresIn: '7d' });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60, // 1시간
      sameSite: 'None'
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      sameSite: 'None'
    });

    //성공 메세지 보내기
    res.status(200).send({ message: 'sussess!' });
  } catch (error) {
    //에러 메세지 보내기
    res.status(500).send({ message: 'Error login user', error: error.message });
  }
};

//로그 아웃 컨트롤러
exports.logout = async (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
  res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'None' });
  res.status(200).send('Logout successful');
};

//로그인 중인지 테스트
exports.testLoggingin = async (req, res) => {
  try {
    const userId = req.user.id;

    // MySQL에서 사용자 이름 조회
    const [rows] = await mysql.execute('SELECT username FROM users where id = ?', [userId]);

    res.send({ message: 'Protected content', username: rows[0].username });
  } catch (error) {
    return res.status(401).send('Invalid or expired accessToken');
  }
};

//이메일 인증을 위한 컨트롤러
exports.emailCheack = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).send({ message: 'Email and code are required' });
  }

  try {
    const storecod = await redisClient.getValue(email);
    if (storecod === code || validator.isEmpty(storecod)) {
      redisClient.delKeyValue(email);
      res.status(200).send({ message: 'sussess!' });
    } else {
      return res.status(400).send({ message: '실패' });
    }
  } catch (err) {
    console.error('에러 발생:', err);
  }
}

//이메일 인증 코드 발송 코드
exports.emailCodeSend = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  const [rows] = await mysql.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    return res.status(404).send({ message: 'This email is already in use' });
  }

  // 6자리 인증 코드 생성
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Redis에 저장 (5분 동안 유효)
  redisClient.setKeyValue(email, code, 60 * 5) //5분동안 저장

  // 이메일 전송
  await mail.sendEmail(email, 'Your Verification Code', `Your verification code is: ${code}`);

  res.send({ message: 'Verification code sent' });
}