const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/product');

router.get('/product', helloWorld);

module.exports = router;