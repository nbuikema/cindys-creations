const express = require("express");
const router = express.Router();

const {signup, signupValidator, signin, signout, isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/auth/signup', signupValidator, signup);
router.post('/auth/signin', signin);
router.get('/auth/signout', signout);

router.param('userId', userById);

module.exports = router;