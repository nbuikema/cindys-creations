const express = require("express");
const router = express.Router();

const {signup, signupValidator, signin, signinValidator, signout} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/auth/signup', signupValidator, signup);
router.post('/auth/signin', signinValidator, signin);
router.get('/auth/signout', signout);

router.param('userId', userById);

module.exports = router;