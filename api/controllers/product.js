const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/product');

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

exports.readProduct = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
};

exports.readAllProducts = (req, res) => {
    Product.find().select('-image').exec((err, products) => {
        if(err) {
            return res.status(400).json({error: 'Could not find products.'});
        }
        res.json(products);
    });
};

exports.readProductsByQuery = (req, res) => {
    let sort = req.query.sort ? req.query.sort : '_id';
    let order = req.query.order ? req.query.order : 'asc';
    let findArgs = req.body.filters;

    Product.find(findArgs).select('-image').sort([[sort, order]]).exec((err, products) => {
        if(err) {
            return res.status(400).json({error: 'Could not find products.'});
        }
        res.json(products);
    });
};

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err) {
            return res.status(400).json({error: 'Image could not be uploaded'});
        }

        let product = req.product;
        product = _.extend(product, fields);
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

exports.deleteProduct = (req, res) => {
    Product.findOneAndDelete(
        {_id: req.product._id},
        (err, product) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            return res.json(`Product: "${product.name}" has been deleted.`);
        }
    );
};

exports.image = (req, res, next) => {
    if(req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
};