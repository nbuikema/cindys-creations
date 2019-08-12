const express = require("express");
const router = express.Router();

const {helloWorld, signup, signupValidator, signin, signout, isSignedIn} = require('../controllers/auth');

router.get('/auth', isSignedIn, helloWorld);
router.post('/auth/signup', signupValidator, signup);
router.post('/auth/signin', signin);
router.get('/auth/signout', signout);

module.exports = router;