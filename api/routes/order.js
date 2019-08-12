const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/order');
const {isSignedIn} = require('../controllers/auth');

router.get('/order', isSignedIn, helloWorld);

module.exports = router;