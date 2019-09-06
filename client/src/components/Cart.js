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
            <div className='d-md-none'>
                <h1 className='text-center'>My Cart</h1>
                <h5 className='text-center'>{`There are ${cart.length} item(s) in your cart.`}</h5>
                <div className='row'>
                    <div className='col-6'>
                        <h2>
                            <Link className='btn btn-success' to='/checkout'>Checkout</Link>
                        </h2>
                    </div>
                    <div className='col-6'>
                        <h5 className='float-right'>
                            <div className='row justify-content-center'>
                                Start Over?
                            </div>
                            <div onClick={onClick} className='btn btn-danger-inverse' style={{cursor: 'pointer'}}>
                                Empty Cart
                            </div>
                        </h5>
                    </div>
                </div>
            </div>
            <div className='d-none d-md-block'>
                <div className='row'>
                    <div className='col-sm-6 col-md-3 my-auto order-2 order-md-1'>
                        <h2>
                            <Link className='btn btn-success' to='/checkout'>Checkout</Link>
                        </h2>
                    </div>
                    <div className='col-sm-12 col-md-6 order-1 order-md-2'>
                        <h1 className='text-center'>My Cart</h1>
                        <h5 className='text-center'>{`There are ${cart.length} item(s) in your cart.`}</h5>
                    </div>
                    <div className='col-sm-6 col-md-3 my-auto order-3 order-md-2'>
                        <h5 className='float-right'>
                            <div className='row justify-content-center'>
                                Start Over?
                            </div>
                            <div onClick={onClick} className='btn btn-danger-inverse' style={{cursor: 'pointer'}}>
                                Empty Cart
                            </div>
                        </h5>
                    </div>
                </div>
            </div>
            <div className='row mt-3'>
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