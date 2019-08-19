import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {isAuthenticated} from './api';

import PrivateRoute from './components/PrivateRoute';

import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Signup from './components/Signup';
import Signin from './components/Signin';
import UserAccount from './components/UserAccount';
import UpdateUserAccount from './components/UpdateUserAccount';
import ManageCategories from './components/ManageCategories';

const App = () => {
    /*
    const [user, setUser] = useState({});

    const init = () => {
        setUser(isAuthenticated().user);
    };

    useEffect(() => {
        init();
    }, []);*/

    return (
        <div>
            <BrowserRouter>
            <Navbar />
                <Switch>
                    <Route path='/' exact component={Home} />
                    <Route path='/products' exact component={Products} />
                    <Route path='/signup' exact component={Signup} />
                    <Route path='/signin' exact component={Signin} />
                    {/* <Route path='/:userId/account' exact render={(props) => <UserAccount {...props} curUser={user} />} /> */}
                    <PrivateRoute path='/:userId/account' exact component={UserAccount} />
                    <PrivateRoute path='/:userId/account/update' exact component={UpdateUserAccount} />
                    <PrivateRoute path='/manage/categories' exact component={ManageCategories} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};

export default App;