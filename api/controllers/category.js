const Category = require('../models/category');

exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({error: 'Category was not found.'});
        }
        req.category = category;
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({error: 'Category could not be created.'});
        }
        res.json({data});
    });
};

exports.readCategory = (req, res) => {
    return res.json(req.category);
};

exports.updateCategory = (req, res) => {
    Category.findOneAndUpdate(
        {_id: req.category},
        {$set: req.body},
        {new: true},
        (err, category) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            return res.json(category);
        }
    );
};

exports.deleteCategory = (req, res) => {
    Category.findOneAndDelete(
        {_id: req.category},
        (err, category) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            return res.json(`Category: "${category.name}" has been deleted.`);
        }
    );
};

exports.readAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if(err) {
            return res.status(400).json({error: 'Could not find categories.'});
        }
        res.json(categories);
    });
};