import React, {useState} from 'react';
import {forgotPassword} from '../api';

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        error: '',
        success: false
    });
    const {email, error, success} = values;

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ''});
        forgotPassword(email).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, success: true});
            }
        });
    };

    const signinForm = () => (
        <form>
            <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
            </div>
            <button onClick={onSubmit} type='submit' className='btn btn-primary'>Reset Password</button>
        </form>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            You will receive an email shortly with instructions for resetting your password.
        </div>
    );

    return (
        <div>
            <div className='container'>
                {showError()}
                {showSuccess()}
                {signinForm()}
            </div>
        </div>
    );
};

export default ForgotPassword;