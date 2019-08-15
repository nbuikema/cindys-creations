import React, {useState} from 'react';
import {signin, authenticate} from '../api';

import Navbar from './Navbar';

const Signin = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        success: false
    });
    const {email, password, error, success} = values;

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ''});
        signin({email, password}).then(data => {
            if(data.error) {
                setValues({...values, error: data.error, success: false});
            } else {
                authenticate(data, () => {
                    setValues({...values, success: true});
                });
            }
        });
    };

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            You have been successfully signed in!
        </div>
    );

    const signinForm = () => (
        <form>
            <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input onChange={onChange('password')} value={password} type='password' className='form-control' id='password' />
            </div>
            <button onClick={onSubmit} type='submit' className='btn btn-primary'>Sign In</button>
        </form>
    );

    return (
        <div>
            <Navbar />
            <div className='container'>
                {showError()}
                {showSuccess()}
                {signinForm()}
            </div>
        </div>
    );
};

export default Signin;