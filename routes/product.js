const express = require('express');
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "cindyscreations",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 1920, height: 1080, crop: "limit" }]
});
const parser = multer({ storage: storage });

const {image, productById, createProduct, readProduct, updateProduct, deleteProduct, readAllProducts, readProductsByQuery, productsByName, readProductsByName} = require('../controllers/product');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/product/create/:userId', isSignedIn, isAuth, isAdmin, parser.array('photos', 10), createProduct);
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