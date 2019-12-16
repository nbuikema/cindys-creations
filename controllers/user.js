const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const {Order} = require('../models/order');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err || !user) {
            return res.status(400).json({error: 'User was not found.'});
        }
        req.profile = user;
        next();
    });
};

exports.readUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    if(req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err, user) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(user);
        }
    );
};

exports.deleteUser = (req, res) => {
    User.findOneAndDelete(
        {_id: req.profile._id},
        (err, user) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            return res.json(`Email: "${user.email}" has been deleted.`);
        }
    );
};

exports.addOrderToUserHistory = (req, res, next) => {
    if(req.body.order.user) {
        let history = [];
        req.body.order.products.forEach((product) => {
            history.push({
                _id: product._id,
                name: product.name,
                description: product.description,
                category: product.category,
                count: product.count,
                transaction_id: req.body.order.transaction_id,
                amount: req.body.order.amount
            });
        });
        User.findOneAndUpdate(
            {_id: req.body.order.user._id},
            {$push: {order_history: history}},
            {new: true},
            (err, data) => {
                if(err) {
                    return res.status(400).json({error: 'Could not update user purchase history.'});
                }
            }
        );
    }
    next();
};

exports.readUserOrderHistory = (req, res) => {
    Order.find({user: req.profile._id}).sort('-createdAt').exec((err, orders) => {
        if(err) {
            return res.status(400).json({error: 'Could not get user order history.'});
        }
        res.json(orders);
    });
};

exports.contact = (req, res) => {
    const emailData = {
        to: 'devnickbusiness@gmail.com',
        from: 'noreply@cindyscreations.com',
        subject: `New Contact`,
        html: `
            <p>Name: ${req.body.name}</p>
            <p>Email: ${req.body.email}</p>
            <p>Message: ${req.body.message}</p>
        `
    };
    sgMail.send(emailData);
}