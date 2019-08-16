import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';

import Home from './components/Home';
import Products from './components/Products';
import Signup from './components/Signup';
import Signin from './components/Signin';
import UserAccount from './components/UserAccount';
import UpdateUserAccount from './components/UpdateUserAccount';

const Router = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/products' exact component={Products} />
                <Route path='/signup' exact component={Signup} />
                <Route path='/signin' exact component={Signin} />
                <PrivateRoute path='/:userId/account' exact component={UserAccount} />
                <PrivateRoute path='/:userId/account/update' exact component={UpdateUserAccount} />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;