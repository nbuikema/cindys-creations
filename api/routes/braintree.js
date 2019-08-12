const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin} = require('../controllers/braintree');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/braintree/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/braintree/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);

router.param('userId', userById);

module.exports = router;