import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated, numItemsInCart} from '../api';

const Navbar = ({history}) => (
    <div>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
            <div className='container'>
                <ul className='navbar-nav mr-auto mt-lg-0'>
                    <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                        <Link className='navbar-brand' to='/'>
                            Cindy's Creations
                        </Link>
                    </li>
                </ul>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarToggler' aria-controls='navbarToggler' aria-expanded='false' aria-label='Toggle Navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarToggler'>
                    <ul className='navbar-nav mr-auto mt-2 mt-lg-0'>
                        <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                            <Link className='nav-link' to='/products'>
                                Products
                            </Link>
                        </li>
                        <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                            <Link className='nav-link' to='/contact'>
                                Contact
                            </Link>
                        </li>
                    </ul>
                    {!isAuthenticated() && (
                        <ul className='navbar-nav ml-auto mt-2 mt-lg-0'>
                            <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                                <Link className='nav-link' to='/cart'>
                                    My Cart <sup>{numItemsInCart()}</sup>
                                </Link>
                            </li>
                            <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                                <Link className='nav-link' to='/signup'>
                                    Sign Up
                                </Link>
                            </li>
                            <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                                <Link className='nav-link' to='/signin'>
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    )} {isAuthenticated() && (
                        <ul className='navbar-nav ml-auto mt-2 mt-lg-0'>
                            <li className='nav-item' data-toggle='collapse' data-target='.navbar-collapse.show'>
                                <Link className='nav-link' to='/cart'>
                                    My Cart <sup>{numItemsInCart()}</sup>
                                </Link>
                            </li>
                            <li className='nav-item dropdown' data-toggle='collapse' data-target='.navbar-collapse.show'>
                                <Link className='nav-link dropdown-toggle' to='/' id='navbarDropdown' role='button' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    {`${isAuthenticated().user.first_name} ${isAuthenticated().user.last_name}`}
                                </Link>
                                <div className='dropdown-menu' aria-labelledby='navbarDropdown'>
                                    <Link className='dropdown-item' to={`/${isAuthenticated().user._id}/account`}>
                                        My Account
                                    </Link>
                                    <Link className='dropdown-item' to={`/${isAuthenticated().user._id}/orders`}>
                                        My Orders
                                    </Link>
                                    {isAuthenticated().user.role === 1 ? (
                                        <div>
                                            <div className='dropdown-divider'></div>
                                            <Link className='dropdown-item' to='/manage/categories'>
                                                Manage Categories
                                            </Link>
                                            <Link className='dropdown-item' to='/manage/products'>
                                                Manage Products
                                            </Link>
                                            <Link className='dropdown-item' to='/manage/orders'>
                                                Manage Orders
                                            </Link>
                                        </div>
                                    ) : ''}
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