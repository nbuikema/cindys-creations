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
        console.log(user)
        if(isAuthenticated()) {
            setValues({
                ...values,
                email: user.email,
                address: user.address
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
                                <option value="AL">Alabama</option>
                                <option value="AK">Alaska</option>
                                <option value="AZ">Arizona</option>
                                <option value="AR">Arkansas</option>
                                <option value="CA">California</option>
                                <option value="CO">Colorado</option>
                                <option value="CT">Connecticut</option>
                                <option value="DE">Delaware</option>
                                <option value="DC">District Of Columbia</option>
                                <option value="FL">Florida</option>
                                <option value="GA">Georgia</option>
                                <option value="HI">Hawaii</option>
                                <option value="ID">Idaho</option>
                                <option value="IL">Illinois</option>
                                <option value="IN">Indiana</option>
                                <option value="IA">Iowa</option>
                                <option value="KS">Kansas</option>
                                <option value="KY">Kentucky</option>
                                <option value="LA">Louisiana</option>
                                <option value="ME">Maine</option>
                                <option value="MD">Maryland</option>
                                <option value="MA">Massachusetts</option>
                                <option value="MI">Michigan</option>
                                <option value="MN">Minnesota</option>
                                <option value="MS">Mississippi</option>
                                <option value="MO">Missouri</option>
                                <option value="MT">Montana</option>
                                <option value="NE">Nebraska</option>
                                <option value="NV">Nevada</option>
                                <option value="NH">New Hampshire</option>
                                <option value="NJ">New Jersey</option>
                                <option value="NM">New Mexico</option>
                                <option value="NY">New York</option>
                                <option value="NC">North Carolina</option>
                                <option value="ND">North Dakota</option>
                                <option value="OH">Ohio</option>
                                <option value="OK">Oklahoma</option>
                                <option value="OR">Oregon</option>
                                <option value="PA">Pennsylvania</option>
                                <option value="RI">Rhode Island</option>
                                <option value="SC">South Carolina</option>
                                <option value="SD">South Dakota</option>
                                <option value="TN">Tennessee</option>
                                <option value="TX">Texas</option>
                                <option value="UT">Utah</option>
                                <option value="VT">Vermont</option>
                                <option value="VA">Virginia</option>
                                <option value="WA">Washington</option>
                                <option value="WV">West Virginia</option>
                                <option value="WI">Wisconsin</option>
                                <option value="WY">Wyoming</option>
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