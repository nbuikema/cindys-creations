const mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');
const {Order, CartItem} = require('../models/order');
const User = require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.createOrder = (req, res) => {
    let emailData;
    const order = new Order(req.body.order);
    if(order.user) {
        User.findById(order.user).exec((err, user) => {
            if(err || !user) {
                return res.status(400).json({error: 'User was not found.'});
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            emailData = {
                to: 'creationsfromcindy@gmail.com',
                from: 'noreply@cindyscreations.com',
                subject: `New Order Placed`,
                html: `
                    <p>Customer name: ${user.first_name} ${user.last_name}</p>
                    <p>Customer email: ${order.email}</p>
                    <p>Delivery address: ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
                    <p>Total products: ${order.products.length}</p>
                    <p>Total cost: $${order.total_price}</p>
                `
            };
        });
    } else {
        emailData = {
            to: 'creationsfromcindy@gmail.com',
            from: 'noreply@cindyscreations.com',
            subject: `New Order Placed`,
            html: `
            <p>Customer name: Unregistered User</p>
            <p>Customer email: ${order.email}</p>
            <p>Delivery address: ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: $${order.total_price}</p>
            `
        };
    }
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({error: 'Could not create order.'});
        }
        sgMail.send(emailData);
        res.json(data);
    });
};

exports.readAllOrders = (req, res) => {
    Order.find().populate('user', 'email first_name last_name address').sort('-createdAt').exec((err, orders) => {
        if(err) {
            return res.status(400).json({error: 'Could not get orders.'});
        }
        res.json(orders);
    });
};

exports.readOrderStatusValues = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
    Order.findOneAndUpdate(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order) => {
            if(err) {
                return res.status(400).json({error: 'Could not update order status.'});
            }
            return res.json(order);
        }
    );
};

exports.orderById = (req, res, next, id) => {
    Order.findById(id).exec((err, order) => {
        if(err || !order) {
            return res.status(400).json({error: 'Order not found.'});
        }
        req.order = order;
        next();
    });
};

exports.ordersByEmail = (req, res, next, query) => {
    Order.find(
        {'email': {$regex: `.*${query}.*`, $options: 'i'}}
    ).populate('user', 'email first_name last_name address').sort('-createdAt').exec((err, orders) => {
        if(err || !orders) {
            return res.status(400).json({error: 'No orders found.'});
        }
        req.orders = orders;
        next();
    });
};

exports.readOrdersByEmail = (req, res) => {
    return res.json(req.orders);
};

exports.deleteOrder = (req, res) => {
    Order.findOneAndDelete(
        {_id: req.order._id},
        (err, order) => {
            if(err) {
                return res.status(400).json({error: 'You are not authorized to do that.'});
            }
            return res.json(`Order: "${order._id}" has been deleted.`);
        }
    );
};