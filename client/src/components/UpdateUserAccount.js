import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {isAuthenticated, readUser, updateUser, update} from '../api';

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

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ''});
        updateUser(props.match.params.userId, token, {first_name, last_name, email, address}).then(
            data => {
                if(data.error) {
                    setValues({...values, error: data.error, success: false});
                } else {
                    update(data, () => {
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
                    });
                }
            }
        );
    };

    const updateUserInfo = () => (
        <div>
            <form>
                <div className='form-group'>
                    <label for='first_name' className='col-sm-2 col-form-label'>First Name</label>
                    <div className='col-sm-10'>
                        <input onChange={onChange('first_name')} type='text' className='form-control-plaintext' id='first_name' placeholder={first_name} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='last_name' className='col-sm-2 col-form-label'>Last Name</label>
                    <div className='col-sm-10'>
                        <input onChange={onChange('last_name')} type='text' className='form-control-plaintext' id='last_name' placeholder={last_name} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='email' className='col-sm-2 col-form-label'>Email</label>
                    <div className='col-sm-10'>
                        <input onChange={onChange('email')} type='text' className='form-control-plaintext' id='email' placeholder={email} />
                    </div>
                </div>
                <div className='form-group'>
                    <label for='address' className='col-sm-2 col-form-label'>Address</label>
                    <div className='col-sm-10'>
                        <input onChange={onChange('address')} type='text' className='form-control-plaintext' id='address' placeholder={address} />
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
                <button onClick={onSubmit} type='submit' className='btn btn-primary'>Update Account</button>
            </form>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='container'>
                {updateUserInfo()}
            </div>
        </div>
    );
};

export default UserAccount;