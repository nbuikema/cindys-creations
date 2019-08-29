import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Contact from './components/Contact';
import Products from './components/Products';
import Product from './components/Product';
import Signup from './components/Signup';
import Signin from './components/Signin';
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
import Loader from './components/Loader';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route path='/loader' exact component={Loader} />
                    <Route path='/' exact component={Home} />
                    <Route path='/contact' exact component={Contact} />
                    <Route path='/products' exact component={Products} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/signin' exact component={Signin} />
                    <PrivateRoute path='/manage/categories' exact component={ManageCategories} />
                    <PrivateRoute path='/manage/products' exact component={ManageProducts} />
                    <PrivateRoute path='/manage/orders' exact component={ManageOrders} />
                    <PrivateRoute path='/:userId/account' exact component={UserAccount} />
                    <PrivateRoute path='/:userId/orders' exact component={UserOrders} />
                    <PrivateRoute path='/:userId/account/update' exact component={UpdateUserAccount} />
                    <PrivateRoute path='/product/create' exact component={CreateProduct} />
                    <PrivateRoute path='/product/update/:productId' exact component={UpdateProduct} />
                    <Route path='/product/:productId' exact component={Product} />
                    <Route path='/cart' exact component={Cart} />
                    <Route path='/checkout' exact component={Checkout} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;