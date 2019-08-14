const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
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

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({error: 'Image could not be uploaded'});
        }
        
        const {name, description, category, price} = fields;
        if(!name) {
            return res.status(400).json({error: 'Name is required.'});
        }
        if(!description) {
            return res.status(400).json({error: 'Description is required.'});
        }
        if(!category) {
            return res.status(400).json({error: 'Category is required.'});
        }
        if(!price) {
            return res.status(400).json({error: 'Price is required.'});
        }
        
        let product = new Product(fields);
        if(files.image) {
            if(files.image.size > 1000000) {
                return res.status(400).json({error: 'Image is too large.'});
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }
        product.save((err, result) => {
            if(err) {
                return res.status(400).json({error: 'Product could not be created.'});
            }
            res.json(result);
        });
    });
};