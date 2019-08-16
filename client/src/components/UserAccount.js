import React, {useState, useEffect} from 'react';
import {Link, Redirect} from 'react-router-dom';
import moment from 'moment';
import {isAuthenticated, readUser, deleteUser, signout} from '../api';

import Navbar from './Navbar';

const UserAccount = (props) => {
    const [values, setValues] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        error: '',
        deleteSuccess: false
    });
    const {id, first_name, last_name, email, address, role, createdAt, updatedAt, error, deleteSuccess} = values;
    const {token} = isAuthenticated();

    const init = userId => {
        readUser(userId, token).then(data => {
            if(data.error) {
                setValues({...values, error: 'Could not get the requested user account.'});
            } else {
                setValues({
                    ...values,
                    id: data._id,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    address: data.address,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    error: ''
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
        <div>
            <form>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>First Name</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{first_name}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Last Name</label>
                    <div className='col-sm-10'>
                    <span className='form-control-plaintext'>{last_name}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Email</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{email}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Address</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{address}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Signed Up</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{moment(createdAt).fromNow()}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Last Updated</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{moment(updatedAt).fromNow()}</span>
                    </div>
                </div>
                <div className='form-group row'>
                    <label className='col-sm-2 col-form-label'>Access Group</label>
                    <div className='col-sm-10'>
                        <span className='form-control-plaintext'>{role === 1 ? 'Admin' : 'Registered User'}</span>
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
            <Navbar />
            <div className='container'>
                {userInfo()}
                {showError()}
                {redirectDeleteSuccess()}
            </div>
        </div>
    );
};

export default UserAccount;