import React, {useState} from 'react';
import {contact} from '../api';

const Contact = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        message: ''
    });
    const {name, email, message} = values;

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const onSubmit = event => {
        event.preventDefault();
        const data = {name, email, message};
        contact(data).then(res => {
            if(res.error) {
                console.log(res.error);
            } else {
                console.log(res);
            }
        });
    };

    const contactForm = () => (
        <form className='mt-3'>
            <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input onChange={onChange('name')} value={name} type='text' className='form-control' id='name' />
            </div>
            <div className='form-group'>
                <label htmlFor='email'>Email Address</label>
                <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
            </div>
            <div className='form-group'>
                <label htmlFor='message'>Message</label>
                <textarea onChange={onChange('message')} value={message} rows='4' className='form-control' id='message' aria-describedby='message'></textarea>
            </div>
            <div className='text-center'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary-inverse mb-3'>Get In Touch</button>
            </div>
        </form>
    );

    return (
        <div className='container'>
            <h1 className='text-center mt-3'>Contact Me</h1>
            <h4 className='text-center'>cindytailors@gmail.com</h4>
            {contactForm()}
        </div>
    );
};

export default Contact;