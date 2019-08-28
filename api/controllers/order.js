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