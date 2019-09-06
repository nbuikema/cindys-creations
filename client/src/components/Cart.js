import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {readCart, clearCart} from '../api';

import ProductCard from './ProductCard';
import Loader from './Loader';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [cartSize, setCartSize] = useState(0);
    const [loading, setLoading] = useState(true);

    const changeCartSize = () => {
        setCartSize(readCart().length);
        setLoading(false);
    };

    useEffect(() => {
        setCart(readCart());
        changeCartSize();
    }, [cartSize]);

    const onClick = () => {
        clearCart(() => {
            changeCartSize();
        });
    };

    const showCart = () => cart.length > 0 ? (
        <div>
            <h2>{`You have ${cart.length} item(s) in your cart.`}<br /><Link to='/checkout'>Checkout</Link> or <Link to='/products'>Continue Shopping</Link></h2>
            <h2>Start Over?
                <span onClick={onClick} className='btn btn-danger-inverse' style={{cursor: 'pointer'}}>
                    Empty Cart
                </span>
            </h2>
            <div className='row'>
                {cart.map((product, i) => (
                    <div key={i} className='col-xs-12 col-sm-6 col-md-4 col-xl-3 mb-4'>
                        <ProductCard key={i} product={product} changeCartSize={changeCartSize} cartSize={cartSize} showAddToCart={false} showCartQuantity={true} showRemoveFromCart={true} />
                    </div>
                ))}
            </div>
        </div>
    ) : '';

    const emptyCart = () => cart.length === 0 ? (
        <h2>Your cart is empty. <Link to='/products'>Continue Shopping</Link></h2>
    ) : '';

    return (
        <div className='container'>
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {showCart()}
                    {emptyCart()}
                </div>
            )}
        </div>
    );
};

export default Cart;