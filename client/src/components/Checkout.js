import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {readCart} from '../api';

import ProductCard from './ProductCard';

const Checkout = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(readCart());
    }, []);

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

    return (
        <div className='container'>
            <h2>Need to make changes? <Link to='/cart'>Go back to cart.</Link></h2>
            <div className='row'>
                <div className='col-9'>
                    <h2>Total To Be Charged: ${cartTotal()}</h2>
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