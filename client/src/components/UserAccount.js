import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';
import {isAuthenticated, readUser, deleteUser, signout} from '../api';

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
        error: '',
        deleteSuccess: false
    });
    const {id, first_name, last_name, email, address, city, state, zip, role, createdAt, updatedAt, error, deleteSuccess} = values;
    const [loading, setLoading] = useState(true);
    
    const {token} = isAuthenticated();

    const init = userId => {
        readUser(userId, token).then(userData => {
            if(userData.error) {
                setValues({...values, error: 'Could not get the requested user account.'});
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

    const userInfo = () => (
        <div className='mt-3'>
            <form>
                <div className='row'>
                    <div className='col'>
                        <h2>User Info</h2>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Email</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{email}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>First Name</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{first_name}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Last Name</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{last_name}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Access Group</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{role === 1 ? 'Admin' : 'Registered User'}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Signed Up</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{moment(createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Last Updated</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{moment(updatedAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <h2>Shipping Info</h2>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Address</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{address}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>City</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{city}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>State</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{state}</span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-3 col-form-label font-weight-bold'>Zip Code</label>
                            <div className='col-sm-9'>
                                <span className='form-control-plaintext'>{zip}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <Link className='btn btn-primary-inverse' to={`/${id}/account/update`}>
                Update Account
            </Link>
            <div onClick={destroy} className='btn btn-danger-inverse mt-1 float-right' style={{cursor: 'pointer'}}>
                Delete Account
            </div>
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
                <h1 className='text-center'>My Account</h1>
                {showError()}
                {redirectDeleteSuccess()}
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        {!address || !city || !state || !zip ? (
                            <h5 className='text-center'>Want faster checkout? <Link to={`/${id}/account/update`}>Add Shipping Info</Link></h5>
                        ) : null}
                        {userInfo()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;