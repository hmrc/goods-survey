var express = require('express');
var router = express.Router();

var classificationController = require('../controllers/classificationController');

/* GET home page. */
router.get('/', classificationController.index);

router.get('/classify-item', classificationController.classifyImage);
router.post('/classify-item', classificationController.handleClassifyImage);

router.get('/thank-you', classificationController.thankYou);

module.exports = router;
