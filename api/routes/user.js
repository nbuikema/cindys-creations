const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/user');
const {isSignedIn} = require('../controllers/auth');

router.get('/user', isSignedIn, helloWorld);

module.exports = router;