import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {isAuthenticated, readOrderHistory} from '../api';

import Loader from './Loader';

const UserOrders = (props) => {
    const [values, setValues] = useState({
        orderHistory: [],
        error: ''
    });
    const {orderHistory, error} = values;
    const [loading, setLoading] = useState(true);

    const {token} = isAuthenticated();

    const init = userId => {
        readOrderHistory(userId, token).then(orderData => {
            if(orderData.error) {
                setValues({...values, error: 'Could not get the requested user order history.'});
            } else {
                setValues({
                    ...values,
                    orderHistory: orderData,
                    error: ''
                });
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        init(props.match.params.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    return (
        <div className='container'>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {showError()}
                    <h2>Order History</h2>
                    {orderHistory.map((order, i) => (
                    <div key={i}>
                        <div className='form-control-plaintext'>Order #{order._id}</div>
                        <ul>
                            <li>Status: {order.status}</li>
                            <li>Created {moment(order.createdAt).fromNow()}</li>
                            <li>Last updated {moment(order.updatedAt).fromNow()}</li>
                            <li>Email: {order.email}</li>
                            <li>Address: {order.address}, {order.city}, {order.state}, {order.zip}</li>
                            <li>Products: 
                                <ul>
                                    {order.products.map((product, i) => (
                                        <li key={i}>
                                            <ul>
                                                <li>Name: {product.name}</li>
                                                <li>Quantity: {product.count}</li>
                                                <li>Price: ${product.price} per unit</li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>Total Charged: ${order.total_price}</li>
                        </ul>
                        <hr />
                    </div>
                    ))}
                </div>
            )}
    </div>
    );
};

export default UserOrders;