import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {isAuthenticated, readUser, updateUser, update} from '../api';

import Loader from './Loader';

const UserAccount = ({match}) => {
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        updatePassword: '',
        confirmPassword: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        role: '',
        error: '',
        success: false
    });
    const {first_name, last_name, email, updatePassword, confirmPassword, address, city, state, zip, role, error, success} = values;
    const [loading, setLoading] = useState(true);
    
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
                    city: data.city,
                    state: data.state,
                    zip: data.zip,
                    role: data.role,
                    error: ''
                });
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        init(match.params.userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        let password;
        event.preventDefault();
        setValues({...values, error: ''});
        if(updatePassword || confirmPassword) {
            if(updatePassword !== confirmPassword) {
                return setValues({...values, error: 'Passwords must match.'});
            } else {
                password = updatePassword;
            }
        }
        updateUser(match.params.userId, token, {first_name, last_name, email, password, address, city, state, zip, role}).then(
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
                            city: data.city,
                            state: data.state,
                            zip: data.zip,
                            role: data.role,
                            error: '',
                            success: true
                        });
                    });
                }
            }
        );
    };

    const updateUserInfo = () => (
        <div className='mt-3'>
            <form>
                <div className='row'>
                    <div className='col'>
                        <h2>User Info</h2>
                        <div className='form-group row'>
                            <label htmlFor='email' className='col-sm-3 col-form-label font-weight-bold'>Email</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('email')} type='text' className='form-control-plaintext' id='email' placeholder={email} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='updatePassword' className='col-sm-3 col-form-label font-weight-bold'>Password</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('updatePassword')} type='text' className='form-control-plaintext' id='updatePassword' placeholder='*************' />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='confirmPassword' className='col-sm-3 col-form-label font-weight-bold'>Confirm Password</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('confirmPassword')} type='text' className='form-control-plaintext' id='confirmPassword' placeholder='*************' />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='first_name' className='col-sm-3 col-form-label font-weight-bold'>First Name</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('first_name')} type='text' className='form-control-plaintext' id='first_name' placeholder={first_name} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='last_name' className='col-sm-3 col-form-label font-weight-bold'>Last Name</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('last_name')} type='text' className='form-control-plaintext' id='last_name' placeholder={last_name} />
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <h2>Shipping Info</h2>
                        <div className='form-group row'>
                            <label htmlFor='address' className='col-sm-3 col-form-label font-weight-bold'>Address</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('address')} type='text' className='form-control-plaintext' id='address' placeholder={address} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='city' className='col-sm-3 col-form-label font-weight-bold'>City</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('city')} type='text' className='form-control-plaintext' id='city' placeholder={city} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='state' className='col-sm-3 col-form-label font-weight-bold'>State</label>
                            <div className='col-sm-9'>
                                <select onChange={onChange('state')} value={state} className='form-control-plaintext state-dropdown'>
                                    <option value=''>Select One</option>
                                    <option value='Alabama'>Alabama</option>
                                    <option value='Alaska'>Alaska</option>
                                    <option value='Arizona'>Arizona</option>
                                    <option value='Arkansas'>Arkansas</option>
                                    <option value='California'>California</option>
                                    <option value='Colorado'>Colorado</option>
                                    <option value='Connecticut'>Connecticut</option>
                                    <option value='Delaware'>Delaware</option>
                                    <option value='District Of Columbia'>District Of Columbia</option>
                                    <option value='Florida'>Florida</option>
                                    <option value='Georgia'>Georgia</option>
                                    <option value='Hawaii'>Hawaii</option>
                                    <option value='Idaho'>Idaho</option>
                                    <option value='Illinois'>Illinois</option>
                                    <option value='Indiana'>Indiana</option>
                                    <option value='Iowa'>Iowa</option>
                                    <option value='Kansas'>Kansas</option>
                                    <option value='Kentucky'>Kentucky</option>
                                    <option value='Louisiana'>Louisiana</option>
                                    <option value='Maine'>Maine</option>
                                    <option value='Maryland'>Maryland</option>
                                    <option value='Massachusetts'>Massachusetts</option>
                                    <option value='Michigan'>Michigan</option>
                                    <option value='Minnesota'>Minnesota</option>
                                    <option value='Mississippi'>Mississippi</option>
                                    <option value='Missouri'>Missouri</option>
                                    <option value='Montana'>Montana</option>
                                    <option value='Nebraska'>Nebraska</option>
                                    <option value='Nevada'>Nevada</option>
                                    <option value='New Hampshire'>New Hampshire</option>
                                    <option value='New Jersey'>New Jersey</option>
                                    <option value='New Mexico'>New Mexico</option>
                                    <option value='New York'>New York</option>
                                    <option value='North Carolina'>North Carolina</option>
                                    <option value='North Dakota'>North Dakota</option>
                                    <option value='Ohio'>Ohio</option>
                                    <option value='Oklahoma'>Oklahoma</option>
                                    <option value='Oregon'>Oregon</option>
                                    <option value='Pennsylvania'>Pennsylvania</option>
                                    <option value='Rhode Island'>Rhode Island</option>
                                    <option value='South Carolina'>South Carolina</option>
                                    <option value='South Dakota'>South Dakota</option>
                                    <option value='Tennessee'>Tennessee</option>
                                    <option value='Texas'>Texas</option>
                                    <option value='Utah'>Utah</option>
                                    <option value='Vermont'>Vermont</option>
                                    <option value='Virginia'>Virginia</option>
                                    <option value='Washington'>Washington</option>
                                    <option value='West Virginia'>West Virginia</option>
                                    <option value='Wisconsin'>Wisconsin</option>
                                    <option value='Wyoming'>Wyoming</option>
                                </select>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label htmlFor='zip' className='col-sm-3 col-form-label font-weight-bold'>Zip Code</label>
                            <div className='col-sm-9'>
                                <input onChange={onChange('zip')} type='text' className='form-control-plaintext' id='zip' placeholder={zip} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='text-center'>
                    <button onClick={onSubmit} type='submit' className='btn btn-primary mb-3'>Save Changes</button>
                </div>
            </form>
        </div>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const redirectSuccess = () => {
        if(success) {
            return <Redirect to={`/${match.params.userId}/account`} />;
        }
    };

    return (
        <div>
            <div className='container'>
                <h1 className='text-center mt-3'>Update Account</h1>
                {showError()}
                {redirectSuccess()}
                {loading ? (
                    <Loader />
                ) : (
                    <div>
                        {updateUserInfo()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserAccount;