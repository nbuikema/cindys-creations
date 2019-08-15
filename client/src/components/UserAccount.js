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
        error: '',
        success: false
    });
    const {first_name, last_name, email, address, role, createdAt, updatedAt, error, success} = values;
    const {token} = isAuthenticated();

    const init = userId => {
        readUser(userId, token).then(data => {
            if(data.error) {
                setValues({...values, error: 'Could not get the requested user account.'});
            } else {
                console.log(data);
                setValues({
                    ...values,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                    address: data.address,
                    role: data.role,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    error: '',
                    success: true
                });
            }
        });
    };

    useEffect(() => {
        init(props.match.params.userId);
    }, []);

    const userInfo = () => (
        <div>
            <form>
                <div className='form-group'>
                    <label for='first_name' className='col-sm-2 col-form-label'>First Name</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='first_name' value={first_name} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='last_name' className='col-sm-2 col-form-label'>Last Name</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='last_name' value={last_name} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='email' className='col-sm-2 col-form-label'>Email</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='email' value={email} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='address' className='col-sm-2 col-form-label'>Address</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='address' value={address} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='createdAt' className='col-sm-2 col-form-label'>Signed Up</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='createdAt' value={moment(createdAt).fromNow()} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='updatedAt' className='col-sm-2 col-form-label'>Last Updated</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='updatedAt' value={moment(updatedAt).fromNow()} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='role' className='col-sm-2 col-form-label'>Access Group</label>
                    <div className='col-sm-10'>
                        <input type='text' readonly className='form-control-plaintext' id='role' value={role === 1 ? 'Admin' : 'Registered User'} />
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='container'>
                {userInfo()}
            </div>
        </div>
    );
};

export default UserAccount;