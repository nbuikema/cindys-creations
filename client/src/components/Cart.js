import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {readCart} from '../api';

import ProductCard from './ProductCard';

const Cart = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(readCart());
    }, []);

    const showCart = () => cart.length > 0 ? (
        <div>
            <h2>{`${cart.length} item(s) in your cart`}</h2>
            {cart.map((product, i) => (
                <ProductCard key={i} product={product} showAddToCart={false} showCartQuantity={true} />
            ))}
        </div>
    ) : '';

    const emptyCart = () => cart.length === 0 ? (
        <h2>Your cart is empty. <Link to='/products'>Continue Shopping</Link></h2>
    ) : '';

    return (
        <div className='container'>
            {showCart()}
            {emptyCart()}
        </div>
    );
};

export default Cart;