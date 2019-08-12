const express = require("express");
const router = express.Router();

const {helloWorld} = require('../controllers/braintree');

router.get('/braintree', helloWorld);

module.exports = router;