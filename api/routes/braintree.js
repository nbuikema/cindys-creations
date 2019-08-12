const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/braintree');
const {isSignedIn} = require('../controllers/auth');

router.get('/braintree', isSignedIn, helloWorld);

module.exports = router;