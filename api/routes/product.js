const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/product/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/product/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);

router.param('userId', userById);

module.exports = router;