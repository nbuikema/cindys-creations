import React from 'react';
import {isAuthenticated} from '../api';

import Navbar from './Navbar';

const UserAccount = () => {
    const {
        user: { _id, first_name, last_name, email, role }
    } = isAuthenticated();

    const userInfo = () => (
        <div className='card'>
            <h3 className='card-header'>My Account</h3>
            <ul className='list-group'>
                <li className='list-group-item'>First Name: {first_name}</li>
                <li className='list-group-item'>Last Name: {last_name}</li>
                <li className='list-group-item'>Email: {email}</li>
                <li className='list-group-item'>
                    Access Group: {role === 1 ? 'Admin' : 'Registered User'}
                </li>
            </ul>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='container'>
                {console.log(isAuthenticated().user)}
                {userInfo()}
            </div>
        </div>
    );
};

export default UserAccount;