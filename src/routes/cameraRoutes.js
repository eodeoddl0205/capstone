const express = require('express');
const router = express.Router();
const cameraController = require('../controllers/cameraController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/aiQueue', authMiddleware, cameraController.enqueueAIRequest);
router.post('/aiResult', authMiddleware, cameraController.getResult);
router.post('/InfoCrawl',authMiddleware,cameraController.infoCrawl);
router.post('/pushCollection', authMiddleware, cameraController.pushCollection);
router.post('/getCollection', authMiddleware, cameraController.getCollection);
router.post('/pushInquiry', cameraController.pushInquiry);

module.exports = router;