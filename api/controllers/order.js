const {Order, CartItem} = require('../models/order');

exports.createOrder = (req, res) => {
    const order = new Order(req.body.order);
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({error: 'Could not create order.'});
        }
        res.json(data);
    });
};

exports.readAllOrders = (req, res) => {
    Order.find().populate('user', 'email first_name last_name address').sort('-created').exec((err, orders) => {
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