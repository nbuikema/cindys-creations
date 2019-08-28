import React, {useState, useEffect} from 'react';
import {isAuthenticated, readAllOrders} from '../api';
import moment from 'moment';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    const {user, token} = isAuthenticated();

    const initOrders = () => {
        readAllOrders(user._id, token).then(data => {
            if(data.error) {
                console.log(data.error);
            } else {
                setOrders(data);
            }
        });
    }

    useEffect(() => {
        initOrders();
    }, []);

    const showNumberOfOrders = () => (
        <div>
            <h2>Current Number of Orders: {orders.length}</h2>
        </div>
    )

    return (
        <div className='container'>
            {showNumberOfOrders()}
            {orders.map((order, i) => (
                <div key={i}>
                    <div className='form-control-plaintext'>Order #{order._id}</div>
                    <ul>
                        <li>Created {moment(order.createdAt).fromNow()}</li>
                        <li>Last updated {moment(order.updatedAt).fromNow()}</li>
                        <li>Status: {order.status}</li>
                        <li>Address: {order.address}</li>
                        <li>User: {order.user ? (
                            <ul>
                                <li>ID: {order.user._id}</li>
                                <li>Name: {order.user.first_name} {order.user.last_name}</li>
                                <li>Email: {order.user.email}</li>
                            </ul>
                        ) : 'Unregistered User'}</li>
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
    );
};

export default ManageOrders;