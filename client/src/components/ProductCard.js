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

    const showButtons = () => showAddToCart ? (
        <div className='text-center btns-products'>
            {showAddToCartBtn(showAddToCart)}
            {showCartQuantityBtn(showCartQuantity)}
            {showRemoveFromCartBtn(showRemoveFromCart)}
        </div>
    ) : (
        <div className='text-center btns-cart'>
            {showAddToCartBtn(showAddToCart)}
            {showCartQuantityBtn(showCartQuantity)}
            {showRemoveFromCartBtn(showRemoveFromCart)}
        </div>
    );

    const showImages = () => (
        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
                {product.images.map((image, i) => {
                    return i === 0 ? (
                        <div key={i} className="carousel-item active no-border">
                            <img src={`${image.url}`} className="d-block w-100" alt="..." />
                        </div>
                    ) : (
                        <div key={i} className="carousel-item no-border">
                            <img src={`${image.url}`} className="d-block w-100" alt="..." />
                        </div>
                    );
                })}
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
            <ol className="carousel-indicators row">
                {product.images.length > 0 && product.images.map((image, i) => {
                    return i === 0 ? (
                        <li className='col-2 px-0 mb-0 active' key={i} data-target="#carouselExampleIndicators" data-slide-to={i}>
                            <img src={`${image.url}`} className="d-block w-100 h-100" alt="..." />
                        </li>
                    ) : (
                        <li className='col-2 px-0 mb-0' key={i} data-target="#carouselExampleIndicators" data-slide-to={i}>
                            <img src={`${image.url}`} className="d-block w-100 h-100" alt="..." />
                        </li>
                    );
                })}
            </ol>
        </div>
    );

    return isClickable ? (
        <div className='h-100 hide-ribbon'>
            <Link className='card text-center h-100' to={`/product/${product._id}`}>
                {redirectCart()}
                {showRibbons()}
                {product._id !== undefined ? (
                    <img className='card-img-top' src={`${product.images[0].url}`} alt={product.name} />
                ) : null}
                <div className='card-body'>
                    <h5 className='card-title'>{product.name}</h5>
                    <p className='card-text'>${product.price}</p>
                </div>
            </Link>
            {showButtons()}
        </div>
    ) : (
        <div className='card'>
            {redirectCart()}
            <h1 className='card-title text-center mb-3'>{product.name}</h1>
            <div className='row'>
                {product._id !== undefined ? (
                    <div className='col-12 col-md-8'>
                        {showImages()}
                    </div>
                ) : null}
                {console.log(product.images)}
                <div className='card-body col-12 col-md-4'>
                    <p className='card-text'>${product.price}</p>
                    <p className='card-text'>{product.description}</p>
                    <p className='card-text'>Added {moment(product.createdAt).format('MMMM Do, YYYY')}</p>
                    <p className='card-text'>Last Updated {moment(product.updatedAt).format('MMMM Do, YYYY')}</p>
                </div>
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