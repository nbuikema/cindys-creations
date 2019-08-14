const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin, productById, createProduct} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/product/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/product/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);
router.post('/product/create/:userId', isSignedIn, isAuth, isAdmin, createProduct);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;