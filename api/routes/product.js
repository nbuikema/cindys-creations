const express = require("express");
const router = express.Router();

const {helloWorldAuth, helloWorldAdmin, productById, createProduct, readProduct, updateProduct, deleteProduct} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.get('/product/auth/:userId', isSignedIn, isAuth, helloWorldAuth);
router.get('/product/admin/:userId', isSignedIn, isAuth, isAdmin, helloWorldAdmin);
router.post('/product/create/:userId', isSignedIn, isAuth, isAdmin, createProduct);
router.get('/product/read/:productId', readProduct);
router.put('/product/update/:productId/:userId', isSignedIn, isAuth, isAdmin, updateProduct);
router.delete('/product/delete/:productId/:userId', isSignedIn, isAuth, isAdmin, deleteProduct);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;