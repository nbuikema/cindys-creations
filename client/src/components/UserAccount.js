import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {isAuthenticated, readUser} from '../api';

import Navbar from './Navbar';

const UserAccount = (props) => {
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        role: '',
        createdAt: '',
        updatedAt: '',
        error: ''
    });
    const {first_name, last_name, email, address, role, createdAt, updatedAt, error} = values;
    const {token} = isAuthenticated();

    const init = userId => {
        readUser(userId, token).then(data => {
            if(data.error) {
                setValues({...values, error: 'Could not get the requested user account.'});
            } else {
                setValues({
                    ...values,
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

    const userInfo = () => (
        <div>
            <form>
                <div className='form-group row'>
                    <label htmlFor='first_name' className='col-sm-2 col-form-label'>First Name</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='first_name' value={first_name} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='last_name' className='col-sm-2 col-form-label'>Last Name</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='last_name' value={last_name} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='email' className='col-sm-2 col-form-label'>Email</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='email' value={email} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='address' className='col-sm-2 col-form-label'>Address</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='address' value={address} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='createdAt' className='col-sm-2 col-form-label'>Signed Up</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='createdAt' value={moment(createdAt).fromNow()} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='updatedAt' className='col-sm-2 col-form-label'>Last Updated</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='updatedAt' value={moment(updatedAt).fromNow()} />
                    </div>
                </div>
                <div className='form-group row'>
                    <label htmlFor='role' className='col-sm-2 col-form-label'>Access Group</label>
                    <div className='col-sm-10'>
                        <input type='text' readOnly className='form-control-plaintext' id='role' value={role === 1 ? 'Admin' : 'Registered User'} />
                    </div>
                </div>
            </form>
        </div>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='container'>
                {userInfo()}
                {showError()}
            </div>
        </div>
    );
};

export default UserAccount;