const express = require('express');
const router = express.Router();

const {image, productById, createProduct, readProduct, updateProduct, deleteProduct, readAllProducts, readProductsByQuery} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/product/create/:userId', isSignedIn, isAuth, isAdmin, createProduct);
router.get('/product/read/:productId', readProduct);
router.get('/products/read/all', readAllProducts);
router.post('/products/read/query', readProductsByQuery);
router.put('/product/update/:productId/:userId', isSignedIn, isAuth, isAdmin, updateProduct);
router.delete('/product/delete/:productId/:userId', isSignedIn, isAuth, isAdmin, deleteProduct);
router.get('/product/image/:productId', image);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;