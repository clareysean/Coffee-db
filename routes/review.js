var express = require('express');
var router = express.Router();
var reviewsCtrl = require('../controllers/review')
const ensureLoggedIn = require('../config/ensureLoggedIn');

// POST /movies/:id/reviews (create review for a movie)

// DELETE /reviews
router.delete('/:id', ensureLoggedIn, reviewsCtrl.delete);

// not verified to work 
router.put('/:coffeeId/:reviewId', reviewsCtrl.update)

module.exports = router;
