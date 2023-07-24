var express = require('express');
var router = express.Router();
var coffeeCtrl = require('../controllers/coffee')
var reviewsCtrl = require('../controllers/review')
const ensureLoggedIn = require('../config/ensureLoggedIn');
const coffee = require('../models/coffee');

router.get('/', coffeeCtrl.index);
router.get('/new', ensureLoggedIn, coffeeCtrl.new);
router.get('/:id', coffeeCtrl.show);
router.post('/', ensureLoggedIn, coffeeCtrl.create);
router.post('/:id/reviews', ensureLoggedIn, reviewsCtrl.create);
//fix //
router.put('/:id', coffeeCtrl.update)
router.delete('/:id', coffeeCtrl.delete)

module.exports = router;