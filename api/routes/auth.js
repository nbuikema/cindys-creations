const express = require("express");
const router = express.Router();

const {helloWorld, signup, signupValidator} = require('../controllers/auth');

router.get('/auth', helloWorld);
router.post('/auth/signup', signupValidator, signup);

module.exports = router;