// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/testLoggingin', authMiddleware, authController.testLoggingin);
router.post('/emailcodesend', authController.emailCodeSend);
router.post('/emailcheack', authController.emailCheack);

module.exports = router;