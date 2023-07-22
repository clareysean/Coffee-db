var express = require('express');
var router = express.Router();
var coffeeCtrl = require('../controllers/coffee')
var reviewsCtrl = require('../controllers/review')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', coffeeCtrl.index);
router.get('/new', ensureLoggedIn, coffeeCtrl.new);
router.get('/:id', coffeeCtrl.show);
router.post('/', ensureLoggedIn, coffeeCtrl.create);
router.post('/:id/reviews', ensureLoggedIn, reviewsCtrl.create);

module.exports = router;