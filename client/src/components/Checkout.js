import React, {useState, useEffect} from 'react';
import DropIn from 'braintree-web-drop-in-react';
import {Link} from 'react-router-dom';
import {readCart, getClientToken, processPayment, clearCart} from '../api';

const Checkout = () => {
    const [values, setValues] = useState({
        clientToken: null,
        instance: {},
        error: '',
        success: false
    });
    const [cart, setCart] = useState([]);
    const [cartSize, setCartSize] = useState(0);

    const {clientToken, error, success} = values;

    const changeCartSize = () => {
        setCartSize(readCart().length);
    };

    const getToken = () => {
        getClientToken().then(data => {
            if(data.error) {
                setValues({...values, error: data.erorr});
            } else {
                setValues({...values, clientToken: data.clientToken});
            }
        })
    };

    useEffect(() => {
        setCart(readCart());
        getToken();
        changeCartSize();
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
                setValues({...values, success: response.success});
                clearCart(() => {
                    changeCartSize();
                });
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            setValues({...values, error: error.message});
        })
    };

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
            <h2>Need to make changes? <Link to='/cart'>Go back to cart</Link></h2>
            <div className='row'>
                <div className='col-9'>
                    <h2>Total To Be Charged: ${cartTotal()}</h2>
                    {showError()}
                    {showSuccess()}
                    {showDropIn()}
                </div>
                <div className='col-3'>
                    {showCart()}
                    {emptyCart()}
                </div>
            </div>
            
        </div>
    );
};

export default Checkout;