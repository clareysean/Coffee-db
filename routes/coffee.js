var express = require('express');
var router = express.Router();
var coffeeCtrl = require('../controllers/coffee')
var reviewsCtrl = require('../controllers/review')
var favouritesCtrl = require('../controllers/favourites')
const ensureLoggedIn = require('../config/ensureLoggedIn');

router.get('/', coffeeCtrl.index);
router.get('/new', ensureLoggedIn, coffeeCtrl.new);
router.get('/:id', coffeeCtrl.show);
router.post('/', ensureLoggedIn, coffeeCtrl.create);
router.post('/:id/reviews', ensureLoggedIn, reviewsCtrl.create);
router.post('/favourites/:id', favouritesCtrl.create)
//fix //
router.put('/:id', coffeeCtrl.update)
router.delete('/:id', coffeeCtrl.delete)

module.exports = router;