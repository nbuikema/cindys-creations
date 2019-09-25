import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import Products from './components/Products';
import Product from './components/Product';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ForgotPassword from './components/ForgotPassword';
import UserAccount from './components/UserAccount';
import UserOrders from './components/UserOrders';
import UpdateUserAccount from './components/UpdateUserAccount';
import ManageCategories from './components/ManageCategories';
import ManageProducts from './components/ManageProducts';
import ManageOrders from './components/ManageOrders';
import CreateProduct from './components/CreateProduct';
import UpdateProduct from './components/UpdateProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/contact' exact component={Contact} />
                    <Route path='/about' exact component={About} />
                    <Route path='/products' exact component={Products} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/signin' exact component={Signin} />
                    <Route path='/password/forgot' exact component={ForgotPassword} />
                    <AdminRoute path='/manage/categories' exact component={ManageCategories} />
                    <AdminRoute path='/manage/products' exact component={ManageProducts} />
                    <AdminRoute path='/manage/orders' exact component={ManageOrders} />
                    <PrivateRoute path='/:userId/account' exact component={UserAccount} />
                    <PrivateRoute path='/:userId/orders' exact component={UserOrders} />
                    <PrivateRoute path='/:userId/account/update' exact component={UpdateUserAccount} />
                    <AdminRoute path='/product/create' exact component={CreateProduct} />
                    <AdminRoute path='/product/update/:productId' exact component={UpdateProduct} />
                    <Route path='/product/:productId' exact component={Product} />
                    <Route path='/cart' exact component={Cart} />
                    <Route path='/checkout' exact component={Checkout} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;