const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/order');

router.get('/order', helloWorld);

module.exports = router;