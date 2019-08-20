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
import UpdateUserAccount from './components/UpdateUserAccount';
import ManageCategories from './components/ManageCategories';
import ManageProducts from './components/ManageProducts';
import CreateProduct from './components/CreateProduct';
import UpdateProduct from './components/UpdateProduct';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/contact' exact component={Contact} />
                    <Route path='/products' exact component={Products} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/signin' exact component={Signin} />
                    <PrivateRoute path='/:userId/account' exact component={UserAccount} />
                    <PrivateRoute path='/:userId/account/update' exact component={UpdateUserAccount} />
                    <PrivateRoute path='/manage/categories' exact component={ManageCategories} />
                    <PrivateRoute path='/manage/products' exact component={ManageProducts} />
                    <PrivateRoute path='/product/create' exact component={CreateProduct} />
                    <PrivateRoute path='/product/update/:productId' exact component={UpdateProduct} />
                    <Route path='/product/:productId' exact component={Product} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;