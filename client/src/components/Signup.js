import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {signup} from '../api';

const Signup = () => {
    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
        error: '',
        success: false
    });
    const {first_name, last_name, email, password, confirm_password, error, success} = values;

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ''});
        if(password !== confirm_password) {
            setValues({...values, error: 'Passwords must match.'})
        } else {
            signup({first_name, last_name, email, password}).then(data => {
                if(data.error) {
                    setValues({...values, error: data.error, success: false});
                } else {
                    setValues({
                        ...values,
                        first_name: '',
                        last_name: '',
                        email: '',
                        password: '',
                        confirm_password: '',
                        error: '',
                        success: true
                    });
                }
            });
        }
    };

    const signupForm = () => (
        <form className='mt-3'>
            <div className='row'>
                <div className='col-sm-12 col-md-6'>
                    <div className='form-group'>
                        <label htmlFor='first_name'>First Name</label>
                        <input onChange={onChange('first_name')} value={first_name} type='text' className='form-control' id='first_name' aria-describedby='firstName' />
                    </div>
                </div>
                <div className='col-sm-12 col-md-6'>
                    <div className='form-group'>
                        <label htmlFor='last_name'>Last Name</label>
                        <input onChange={onChange('last_name')} value={last_name} type='text' className='form-control' id='last_name' aria-describedby='lastName' />
                    </div>
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
            </div>
            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input onChange={onChange('password')} value={password} type='password' className='form-control' id='password' />
            </div>
            <div className='form-group'>
                <label htmlFor='confirm_password'>Confirm Password</label>
                <input onChange={onChange('confirm_password')} value={confirm_password} type='password' className='form-control' id='confirm_password' />
            </div>
            <div className='text-center'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary-inverse mb-3'>Sign Up</button>
            </div>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            You have successfully signed up! Please <Link to='/signin'>sign in</Link>.
        </div>
    );

    return (
        <div>
            <div className='container'>
                <h1 className='text-center mt-3'>Create Account</h1>
                <h4 className='text-center'>Already have an account? <Link to='/signin'>Sign In Now</Link></h4>
                {showError()}
                {showSuccess()}
                {signupForm()}
            </div>
        </div>
    );
};

export default Signup;