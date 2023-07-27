var express = require('express');
var router = express.Router();
var searchCtrl = require('../controllers/search')

router.get('/', searchCtrl.search)

module.exports = router;