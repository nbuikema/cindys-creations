const sgMail = require('@sendgrid/mail');
const {Order, CartItem} = require('../models/order');

sgMail.setApiKey(process.env.SENDGRID_KEY);

exports.createOrder = (req, res) => {
    const order = new Order(req.body.order);
    console.log(order);
    /*let emailData;
    if(order.user) {
        emailData = {
            to: 'devnickbusiness@gmail.com',
            from: 'noreply@cindyscreations.com',
            subject: `A new order has been placed`,
            html: `
            <p>Customer name: ${order.user.first_name} ${order.user.last_name}</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.total_price}</p>
            <p>Login to dashboard to view more details.</p>
        `
        };
    } else {
        emailData = {
            to: 'devnickbusiness@gmail.com',
            from: 'noreply@cindyscreations.com',
            subject: `A new order has been placed`,
            html: `
            <p>Customer name: Unregistered User</p>
            <p>Total products: ${order.products.length}</p>
            <p>Total cost: ${order.total_price}</p>
            <p>Login to dashboard to view more details.</p>
        `
        };
    }
    order.save((error, data) => {
        if(error) {
            return res.status(400).json({error: 'Could not create order.'});
        }
        sgMail.send(emailData);
        res.json(data);
    });*/
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