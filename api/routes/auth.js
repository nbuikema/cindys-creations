const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin, signup, signupValidator, signin, signout, isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/auth/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/auth/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);
router.post('/auth/signup', signupValidator, signup);
router.post('/auth/signin', signin);
router.get('/auth/signout', signout);

router.param('userId', userById);

module.exports = router;