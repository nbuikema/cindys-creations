import React, {useState} from 'react';
import {Redirect, Link} from 'react-router-dom';
import {signin, authenticate} from '../api';

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

    const signinForm = () => (
        <form className='mt-3'>
            <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input onChange={onChange('password')} value={password} type='password' className='form-control' id='password' />
            </div>
            <div className='text-center'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary'>Sign In</button>
            </div>
            <div className='text-center'>
                <Link className='btn btn-warning' to={`/password/forgot`}>
                    Forgot Password?
                </Link>
            </div>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const redirectSuccess = () => {
        if(success) {
            return <Redirect to='/' />;
        }
    };

    return (
        <div>
            <div className='container'>
                <h1 className='text-center mt-3'>Welcome Back!</h1>
                <h5 className='text-center'>Don't have an account? <Link to='/signup'>Sign Up Now</Link></h5>
                {showError()}
                {redirectSuccess()}
                {signinForm()}
            </div>
        </div>
    );
};

export default Signin;