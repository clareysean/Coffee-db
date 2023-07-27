var express = require('express');
var router = express.Router();
var reviewsCtrl = require('../controllers/review')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.delete('/:id', ensureLoggedIn, reviewsCtrl.delete);
router.put('/:coffeeId/:reviewId', reviewsCtrl.update)

module.exports = router;
