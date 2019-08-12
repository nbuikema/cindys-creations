const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/product');
const {isSignedIn} = require('../controllers/auth');

router.get('/product', isSignedIn, helloWorld);

module.exports = router;