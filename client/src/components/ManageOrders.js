import React, {useState, useEffect} from 'react';
import {isAuthenticated, readAllOrders, readOrderStatusValues, updateOrderStatus, readOrdersByEmail} from '../api';
import moment from 'moment';

import Loader from './Loader';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);
    const [loading, setLoading] = useState(true);

    const {user, token} = isAuthenticated();

    const initOrders = () => {
        readAllOrders(user._id, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setOrders(data);
                setLoading(false);
            }
        });
    };

    const initStatusValues = () => {
        readOrderStatusValues(user._id, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setStatusValues(data);
            }
        });
    };

    useEffect(() => {
        initOrders();
        initStatusValues();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showNumberOfOrders = () => (
        <div>
            <h2>Current Number of Orders: {orders.length}</h2>
        </div>
    );

    const onChange = orderId => event => {
        updateOrderStatus(user._id, token, orderId, event.target.value).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                initOrders();
            }
        });
    };

    const showStatus = order => (
        <div className='row'>
            <div className='col-sm-2'>Status: {order.status}</div>
            <select className='col-sm-10' onChange={onChange(order._id)}>
                <option>Update Status</option>
                {statusValues.map((status, i) => (
                    <option key={i} value={status}>{status}</option>
                ))}
            </select>
        </div>
    );

    const onSearchChange = event => {
        if(event.target.value.length === 0) {
            initOrders();
        } else {
            readOrdersByEmail(event.target.value).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setOrders(data);
                }
            });
        }
    };

    return (
        <div className='container'>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className='form-group'>
                        <input onChange={onSearchChange} type='text' className='form-control' id='searchOrders' aria-describedby='searchOrders' placeholder='Search orders by email...' />
                    </div>
                    {showNumberOfOrders()}
                    {orders.map((order, i) => (
                        <div key={i}>
                            <div className='form-control-plaintext'>Order #{order._id}</div>
                            <ul>
                                <li>{showStatus(order)}</li>
                                <li>Created {moment(order.createdAt).fromNow()}</li>
                                <li>Last updated {moment(order.updatedAt).fromNow()}</li>
                                {order.user ? (
                                    <div>
                                        <li>Name: {order.user.first_name} {order.user.last_name}</li>
                                        <li>Email: {order.email}</li>
                                    </div>
                                ) : (
                                    <div>
                                        <li>Name: Unregistered User</li>
                                        <li>Email: {order.email}</li>
                                    </div>
                                )}
                                <li>Address: {order.address}, {order.city}, {order.state}, {order.zip}</li>
                                <li>Products: 
                                    <ul>
                                        {order.products.map((product, i) => (
                                            <li key={i}>
                                                <ul>
                                                    <li>ID: {product._id}</li>
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

export default ManageOrders;