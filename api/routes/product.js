const express = require('express');
const router = express.Router();

const {image, productById, createProduct, readProduct, updateProduct, deleteProduct, readAllProducts, readProductsByQuery, productsByName, readProductsByName} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/product/create/:userId', isSignedIn, isAuth, isAdmin, createProduct);
router.get('/product/read/:productId', readProduct);
router.get('/products/read/all', readAllProducts);
router.post('/products/read/query', readProductsByQuery);
router.get('/products/read/name/:productName', readProductsByName);
router.put('/product/update/:productId/:userId', isSignedIn, isAuth, isAdmin, updateProduct);
router.delete('/product/delete/:productId/:userId', isSignedIn, isAuth, isAdmin, deleteProduct);
router.get('/product/image/:productId', image);

router.param('userId', userById);
router.param('productId', productById);
router.param('productName', productsByName);

module.exports = router;