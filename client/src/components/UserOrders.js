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
            <h1 className='text-center mb-3'>Order History</h1>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {showError()}
                    {orderHistory.map((order, i) => (
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
                                        <span className='form-control-plaintext'>{order.status}</span>
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
                        <hr />
                    </div>
                    ))}
                </div>
            )}
    </div>
    );
};

export default UserOrders;