require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = "742E2B6B1BB316C73899A553E312B";

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // accessToken 검증 시도
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, secretKey);
            req.user = decoded; // accessToken이 유효하면 요청 객체에 사용자 정보를 추가
            next();
        } catch (error) {
        }
    }

    // accessToken이 없거나 검증에 실패한 경우 refreshToken 검증
    if (!accessToken || !req.user) {
        if (!refreshToken) {
            return res.status(401).json({ error: "Access denied. No tokens provided." });
        }
        try {
            const decoded = jwt.verify(refreshToken, secretKey);
            // refreshToken이 유효하면 새 accessToken 발급
            const newAccessToken = jwt.sign({ id: decoded.id }, secretKey, { expiresIn: '1h' });

            // 새 accessToken을 쿠키에 설정
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 /*1시간*/ ,sameSite: 'None'});

            req.user = decoded; // 요청 객체에 사용자 정보를 추가
            next();
        } catch (error) {
            // refreshToken도 유효하지 않은 경우
            return res.status(401).json({ error: "Invalid refresh token." });
        }
    }
};

module.exports = verifyToken;