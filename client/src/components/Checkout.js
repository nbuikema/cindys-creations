import React, {useState, useEffect} from 'react';
import DropIn from 'braintree-web-drop-in-react';
import {Link} from 'react-router-dom';
import {readCart, getClientToken, processPayment, clearCart, isAuthenticated, createOrder} from '../api';

import Loader from './Loader';

const Checkout = () => {
    const [values, setValues] = useState({
        clientToken: null,
        instance: {},
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        error: '',
        success: false
    });
    const [cart, setCart] = useState([]);
    const [cartSize, setCartSize] = useState(0);

    const {clientToken, email, address, city, state, zip, error, success} = values;

    const changeCartSize = () => {
        setCartSize(readCart().length);
    };

    const getToken = () => {
        getClientToken().then(data => {
            if(data.error) {
                setValues({error: data.erorr});
            } else {
                setValues({...values, clientToken: data.clientToken});
            }
        });
    };

    const initUser = () => {
        const {user} = isAuthenticated();
        if(isAuthenticated()) {
            setValues({
                ...values,
                email: user.email,
                address: user.address,
                city: user.city,
                state: user.state,
                zip: user.zip
            });
        }
    };

    useEffect(() => {
        setCart(readCart());
        getToken();
        initUser();
        changeCartSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartSize]);

    const cartTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCart = () => cart.length > 0 ? (
        <div>
            <h2>Order Summary</h2>
            {cart.map((product, i) => (
                <div key={i}>
                    <hr />
                    <p>{product.name}</p>
                    <p>Quantity: {product.count}</p>
                    <p>${product.price} each</p>
                </div>
            ))}
        </div>
    ) : '';

    const emptyCart = () => cart.length === 0 ? (
        <h2>Your cart is empty. <Link to='/products'>Continue Shopping</Link></h2>
    ) : '';

    const onClick = () => {
        let nonce;
        let getNonce = values.instance.requestPaymentMethod().then(data => {
            nonce = data.nonce;
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: cartTotal()
            };
            processPayment(paymentData).then(response => {
                const order = {
                    products: cart,
                    transaction_id: response.transaction.id,
                    total_price: response.transaction.amount,
                    address: address,
                    user: isAuthenticated().user ? isAuthenticated().user : undefined
                };
                createOrder({order: order}).then(res => {
                    setValues({...values, address: '', success: response.success});
                    clearCart(() => {
                        changeCartSize();
                    });
                });
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            setValues({...values, error: error.message});
        })
    };

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
    };

    const showDelivery = () => (
        <div>
            <form>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input onChange={onChange('email')} value={email} type='email' className='form-control' id='email' aria-describedby='email' />
                </div>
                <div className='form-group'>
                    <label htmlFor='address'>Address</label>
                    <input onChange={onChange('address')} value={address} type='text' className='form-control' id='address' aria-describedby='address' />
                </div>
                <div className='row'>
                    <div className='col'>
                        <div className='form-group'>
                            <label htmlFor='city'>City</label>
                            <input onChange={onChange('city')} value={city} type='text' className='form-control' id='city' aria-describedby='city' />
                        </div>
                    </div>
                    <div className='col'>
                        <div className='form-group'>
                            <label htmlFor='state'>State</label>
                            <select onChange={onChange('state')} value={state} className='form-control'>
                                <option>Select One</option>
                                <option value='Alabama'>Alabama</option>
                                <option value='Alaska'>Alaska</option>
                                <option value='Arizona'>Arizona</option>
                                <option value='Arkansas'>Arkansas</option>
                                <option value='California'>California</option>
                                <option value='Colorado'>Colorado</option>
                                <option value='Connecticut'>Connecticut</option>
                                <option value='Delaware'>Delaware</option>
                                <option value='District Of Columbia'>District Of Columbia</option>
                                <option value='Florida'>Florida</option>
                                <option value='Georgia'>Georgia</option>
                                <option value='Hawaii'>Hawaii</option>
                                <option value='Idaho'>Idaho</option>
                                <option value='Illinois'>Illinois</option>
                                <option value='Indiana'>Indiana</option>
                                <option value='Iowa'>Iowa</option>
                                <option value='Kansas'>Kansas</option>
                                <option value='Kentucky'>Kentucky</option>
                                <option value='Louisiana'>Louisiana</option>
                                <option value='Maine'>Maine</option>
                                <option value='Maryland'>Maryland</option>
                                <option value='Massachusetts'>Massachusetts</option>
                                <option value='Michigan'>Michigan</option>
                                <option value='Minnesota'>Minnesota</option>
                                <option value='Mississippi'>Mississippi</option>
                                <option value='Missouri'>Missouri</option>
                                <option value='Montana'>Montana</option>
                                <option value='Nebraska'>Nebraska</option>
                                <option value='Nevada'>Nevada</option>
                                <option value='New Hampshire'>New Hampshire</option>
                                <option value='New Jersey'>New Jersey</option>
                                <option value='New Mexico'>New Mexico</option>
                                <option value='New York'>New York</option>
                                <option value='North Carolina'>North Carolina</option>
                                <option value='North Dakota'>North Dakota</option>
                                <option value='Ohio'>Ohio</option>
                                <option value='Oklahoma'>Oklahoma</option>
                                <option value='Oregon'>Oregon</option>
                                <option value='Pennsylvania'>Pennsylvania</option>
                                <option value='Rhode Island'>Rhode Island</option>
                                <option value='South Carolina'>South Carolina</option>
                                <option value='South Dakota'>South Dakota</option>
                                <option value='Tennessee'>Tennessee</option>
                                <option value='Texas'>Texas</option>
                                <option value='Utah'>Utah</option>
                                <option value='Vermont'>Vermont</option>
                                <option value='Virginia'>Virginia</option>
                                <option value='Washington'>Washington</option>
                                <option value='West Virginia'>West Virginia</option>
                                <option value='Wisconsin'>Wisconsin</option>
                                <option value='Wyoming'>Wyoming</option>
                            </select>
                        </div>
                    </div>
                    <div className='col'>
                        <div className='form-group'>
                            <label htmlFor='zip'>Zip Code</label>
                            <input onChange={onChange('zip')} value={zip} type='text' className='form-control' id='zip' aria-describedby='zip' />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

    const showDropIn = () => (
        <div>
            {clientToken !== null && cart.length > 0 ? (
                <div>
                    <DropIn options={{authorization: clientToken}} onInstance={instance => (values.instance = instance)} />
                    <button onClick={onClick} className='btn btn-success btn-block'>Confirm Purchase</button>
                </div>
            ) : ''}
        </div>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className='alert alert-success' style={{display: success ? '' : 'none'}}>
            Your purchase was successful.
        </div>
    );

    return (
        <div className='container'>
            {isAuthenticated() ? (
                clientToken && email || success ? (
                    <div>
                        <h2>Need to make changes? <Link to='/cart'>Go back to cart</Link></h2>
                        <div className='row'>
                            <div className='col-9'>
                                <h2>Total To Be Charged: ${cartTotal()}</h2>
                                {showError()}
                                {showSuccess()}
                                {showDelivery()}
                                {showDropIn()}
                            </div>
                            <div className='col-3'>
                                {showCart()}
                                {emptyCart()}
                            </div>
                        </div>
                    </div>
                    ) : (
                        <Loader />
                    )
                ) : (
                clientToken || success ? (
                    <div>
                        <h2>Need to make changes? <Link to='/cart'>Go back to cart</Link></h2>
                        <div className='row'>
                            <div className='col-9'>
                                <h2>Total To Be Charged: ${cartTotal()}</h2>
                                {showError()}
                                {showSuccess()}
                                {showDelivery()}
                                {showDropIn()}
                            </div>
                            <div className='col-3'>
                                {showCart()}
                                {emptyCart()}
                            </div>
                        </div>
                    </div>
                    ) : (
                        <Loader />
                    )
                )
            }
        </div>
    );
};

export default Checkout;