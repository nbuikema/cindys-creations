import React, {useState} from 'react';
import moment from 'moment';
import {Link, Redirect} from 'react-router-dom';
import {readCart, addProductToCart, updateQuantity, removeProductFromCart} from '../api';
const API = process.env.REACT_APP_API_URL;

const ProductCard = ({product, changeCartSize, cartSize, showAddToCart = true, showCartQuantity = false, showRemoveFromCart = false, isClickable = true}) => {
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(product.count);
    const [previousDate] = useState(moment((Date.now() - (30 * 24 * 60 * 60 * 1000))).format('MMMM Do, YYYY'));

    const addToCart = () => {
        addProductToCart(product, () => {
            setAddedToCart(true);
        });
    };

    const redirectCart = () => {
        if(addedToCart) {
            return <Redirect to='/cart' />;
        }
    };

    const showAddToCartBtn = (showAddToCart) => showAddToCart && ( 
        <button onClick={addToCart} className='btn btn-secondary mx-4'>
            Add to Cart
        </button>
    );

    const onChange = productId => event => {
        setQuantity(event.target.value < 1 ? 1 : event.target.value);
        if (event.target.value >= 1) {
            updateQuantity(productId, event.target.value);
        }
    };

    const showCartQuantityBtn = (showCartQuantity) => showCartQuantity && (
        <div className='input-group justify-content-center'>
            <span className='input-group-text quantity-tag'>Quantity</span>
            <input className='form-control quantity' type='number' value={quantity} onChange={onChange(product._id)} />
        </div>
    );

    const onClick = productId => {
        removeProductFromCart(productId);
        changeCartSize(readCart().length);
    };

    const showRemoveFromCartBtn = showRemoveFromCart => showRemoveFromCart && (
        <button onClick={() => onClick(product._id)} className='btn btn-danger mt-2'>
            Remove Product
        </button>
    );

    const showRibbons = () => {
        if(moment(product.createdAt).format('MMMM Do, YYYY') > previousDate) {
            return <div className='corner-ribbon blue-ribbon'>New!</div>;
        } else if(moment(product.updatedAt).format('MMMM Do, YYYY') > previousDate) {
            return <div className='corner-ribbon orange-ribbon'>Updated!</div>;
        }
    };

    return isClickable ? (
        <div className='h-100 hide-ribbon'>
            <Link className='card text-center h-100' to={`/product/${product._id}`}>
                {redirectCart()}
                {showRibbons()}
                {product._id !== undefined ? (
                    <img src={`${API}/product/image/${product._id}`} alt={product.name} />
                ) : null}
                <div className='card-body'>
                    <h5 className='card-title'>{product.name}</h5>
                    <p className='card-text'>${product.price}</p>
                </div>
                <div className='text-center'>
                    {showAddToCartBtn(showAddToCart)}
                    {showCartQuantityBtn(showCartQuantity)}
                    {showRemoveFromCartBtn(showRemoveFromCart)}
                </div>
            </Link>
        </div>
    ) : (
        <div className='card'>
            {redirectCart()}
            <h1 className='card-title text-center mb-3'>{product.name}</h1>
            {product._id !== undefined ? (
                <img src={`${API}/product/image/${product._id}`} alt={product.name} />
            ) : null}
            <div className='card-body'>
                <p className='card-text'>${product.price}</p>
                <p className='card-text'>{product.description}</p>
                <p className='card-text'>Added {moment(product.createdAt).format('MMMM Do, YYYY')}</p>
                <p className='card-text'>Last Updated {moment(product.updatedAt).format('MMMM Do, YYYY')}</p>
            </div>
            <div className='text-center'>
                {showAddToCartBtn(showAddToCart)}
                {showCartQuantityBtn(showCartQuantity)}
                {showRemoveFromCartBtn(showRemoveFromCart)}
            </div>
        </div>
    );
};

export default ProductCard;