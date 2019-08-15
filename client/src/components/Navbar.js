import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from '../api';

const Navbar = ({history}) => (
    <div>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className='container'>
                <Link className='navbar-brand' to='/'>
                    Cindy's Creations
                </Link>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarToggler' aria-controls='navbarToggler' aria-expanded='false' aria-label='Toggle Navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarToggler'>
                    <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>
                                Products
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link' to='/'>
                                Contact
                            </Link>
                        </li>
                    </ul>
                    {!isAuthenticated() && (
                        <ul className='navbar-nav ml-auto mt-2 mt-lg-0'>
                            <li className='nav-item'>
                                <Link className='nav-link' to='/signup'>
                                    Sign Up
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link className='nav-link' to='/signin'>
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    )} {isAuthenticated() && (
                        <ul className='navbar-nav ml-auto mt-2 mt-lg-0'>
                            <li className='nav-item dropdown'>
                                <Link className='nav-link dropdown-toggle' to='/' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    {`${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}`}
                                </Link>
                                <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                    <Link className='dropdown-item' to={`/${isAuthenticated().user._id}/account`}>
                                        My Account
                                    </Link>
                                    <Link className='dropdown-item' to={`/${isAuthenticated().user._id}/account/update`}>
                                        Update Account
                                    </Link>
                                    <div className='dropdown-divider'></div>
                                    <span className='dropdown-item' style={{cursor: 'pointer'}} onClick={() => signout(() => {history.push('/');})}>
                                        Sign Out
                                    </span>
                                </div>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    </div>
);

export default withRouter(Navbar);