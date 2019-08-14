const Product = require('../models/product');

exports.helloWorldAuth = (req, res) => {
    res.send('hello world product routes authorized user');
};

exports.helloWorldAdmin = (req, res) => {
    res.send('hello world product routes admin');
};

exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if(err || !product) {
            return res.status(400).json({error: 'Product was not found.'});
        }
        req.product = product;
        next();
    });
};