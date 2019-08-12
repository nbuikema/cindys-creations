const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin, userById} = require('../controllers/user');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');

router.get('/user/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/user/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);

router.param('userId', userById);

module.exports = router;