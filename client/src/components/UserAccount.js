import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';
import {isAuthenticated, readUser, deleteUser, signout, readOrderHistory} from '../api';

import Loader from './Loader';

const UserAccount = (props) => {
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        orderHistory: [],
        error: '',
        deleteSuccess: false
    });
    const {id, first_name, last_name, email, address, city, state, zip, role, createdAt, updatedAt, orderHistory, error, deleteSuccess} = values;
    const {token} = isAuthenticated();

    const init = userId => {
        readUser(userId, token).then(userData => {
            if(userData.error) {
                setValues({...values, error: 'Could not get the requested user account.'});
            } else {
                readOrderHistory(userId, token).then(orderData => {
                    if(orderData.error) {
                        setValues({...values, error: 'Could not get the requested user order history.'});
                    } else {
                        setValues({
                            ...values,
                            id: userData._id,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            email: userData.email,
                            address: userData.address,
                            city: userData.city,
                            state: userData.state,
                            zip: userData.zip,
                            role: userData.role,
                            createdAt: userData.createdAt,
                            updatedAt: userData.updatedAt,
                            orderHistory: orderData,
                            error: ''
                        });
                    }
                });
            }
        });
    };

    useEffect(() => {
        init(props.match.params.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const destroy = () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account? This process cannot be undone.');
        if(confirmDelete) {
            deleteUser(props.match.params.userId, token).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    signout(() => {
                        setValues({
                            first_name: '',
                            last_name: '',
                            email: '',
                            address: '',
                            city: '',
                            state: '',
                            zip: '',
                            role: '',
                            createdAt: '',
                            updatedAt: '',
                            error: '',
                            deleteSuccess: true
                        });
                    });
                }
            });
        }
    };

    const userInfo = () => first_name ? (
        <div>
            <form>
                <div className='row'>
                    <div className='col'>
                        <h2>User Information</h2>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>First Name</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{first_name}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Last Name</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{last_name}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Email</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{email}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Access Group</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{role === 1 ? 'Admin' : 'Registered User'}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Signed Up</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Last Updated</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{moment(updatedAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <h2>Delivery Information</h2>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Address</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{address}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>City</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{city}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>State</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{state}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label'>Zip Code</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{zip}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <Link className='btn btn-info' to={`/${id}/account/update`}>
                Update Account
            </Link>
            <span onClick={destroy} className='btn btn-danger' style={{cursor: 'pointer'}}>
                Delete Account
            </span>
        </div>
    ) : (
        <div>
            <Loader />
        </div>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const redirectDeleteSuccess = () => {
        if(deleteSuccess) {
            return <Redirect to='/' />;
        }
    };

    return (
        <div>
            <div className='container'>
                {showError()}
                {redirectDeleteSuccess()}
                {userInfo()}
                <h2>Order History</h2>
                {orderHistory.map((order, i) => (
                <div key={i}>
                    <div className='form-control-plaintext'>Order #{order._id}</div>
                    <ul>
                        <li>Status: {order.status}</li>
                        <li>Created {moment(order.createdAt).fromNow()}</li>
                        <li>Last updated {moment(order.updatedAt).fromNow()}</li>
                        <li>Address: {order.address}</li>
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
        </div>
    );
};

export default UserAccount;