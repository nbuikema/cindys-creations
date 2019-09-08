import React, {useState, useEffect} from 'react';
import {isAuthenticated, readAllOrders, readOrderStatusValues, updateOrderStatus, readOrdersByEmail, deleteOrder} from '../api';
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
            <h4 className='text-center'>Current Number of Orders: {orders.length}</h4>
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
        <span className='ml-4'>
            <select onChange={onChange(order._id)}>
                <option>Update Status</option>
                {statusValues.map((status, i) => (
                    <option key={i} value={status}>{status}</option>
                ))}
            </select>
        </span>
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

    const destroy = orderId => {
        const confirmDelete = window.confirm('Are you sure you want to delete this order? This process cannot be undone.');
        if(confirmDelete) {
            deleteOrder(orderId, user._id, token).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    initOrders();
                }
            });
        }
    };

    return (
        <div className='container'>
            <h1 className='text-center mt-3'>Manage Orders</h1>
            {showNumberOfOrders()}
            {loading ? (
                <Loader />
            ) : (
                <div className='mt-3'>
                    <div className='form-group'>
                        <h5>Search Orders by Email</h5>
                        <input onChange={onSearchChange} type='text' className='form-control' id='searchOrders' aria-describedby='searchOrders' placeholder='Search orders...' />
                    </div>
                    {orders.map((order, i) => (
                    <div key={i}>
                        <div className='row mb-3'>
                            <div className='col-sm-12 col-md-6'>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Order #</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{order._id}</span>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Status</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{order.status} {showStatus(order)}</span>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Placed</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{moment(order.createdAt).fromNow()} ({moment(order.createdAt).format('MMMM Do, YYYY')})</span>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Last Updated</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{moment(order.updatedAt).fromNow()} ({moment(order.updatedAt).format('MMMM Do, YYYY')})</span>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Email</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{order.email}</span>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Address</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>{order.address}, {order.city}, {order.state}, {order.zip}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-12 col-md-6'>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Products Ordered</label>
                                    <div className='col-sm-9'>
                                        <div className='form-control-plaintext'>
                                            {order.products.map((product, i) => (
                                                <div className='mb-3' key={i}>
                                                    <div>ID: {product._id}</div>
                                                    <div>Name: {product.name}</div>
                                                    <div>Quantity: {product.count}</div>
                                                    <div>Price: ${parseFloat(Math.round((product.price) * 100) / 100).toFixed(2)} per unit</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label className='col-sm-3 col-form-label font-weight-bold'>Total Charged</label>
                                    <div className='col-sm-9'>
                                        <span className='form-control-plaintext'>${parseFloat(Math.round((order.total_price) * 100) / 100).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={() => destroy(order._id)} className='btn btn-danger' style={{cursor: 'pointer'}}>
                            Delete Order
                        </div>
                        <hr />
                    </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageOrders;