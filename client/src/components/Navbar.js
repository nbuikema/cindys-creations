import React from 'react';
import {Link, withRouter} from 'react-router-dom';

const Navbar = ({history}) => (
    <div>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
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
                <ul className='navbar-nav ml-auto mt-2 mt-lg-0'>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/'>
                            Signup
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link className='nav-link' to='/'>
                            Signin
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
);

export default withRouter(Navbar);