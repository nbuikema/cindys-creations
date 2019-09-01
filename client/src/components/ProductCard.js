import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {readCart, addProductToCart, updateQuantity, removeProductFromCart} from '../api';
const API = process.env.REACT_APP_API_URL;

const ProductCard = ({product, changeCartSize, cartSize, showViewProduct = true, showAddToCart = true, showCartQuantity = false, showRemoveFromCart = false}) => {
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(product.count);

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

    const showViewProductBtn = (showViewProduct) => showViewProduct && ( 
        <Link className='btn btn-primary' to={`/product/${product._id}`}>
            View Product
        </Link>
    );

    const showAddToCartBtn = (showAddToCart) => showAddToCart && ( 
        <button onClick={addToCart} className='btn btn-info'>
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
        <div className='input-group'>
            <span className='input-group-text'>Adjust Quantity</span>
            <input className='form-control' type='number' value={quantity} onChange={onChange(product._id)} />
        </div>
    );

    const onClick = productId => {
        removeProductFromCart(productId);
        changeCartSize(readCart().length);
    };

    const showRemoveFromCartBtn = showRemoveFromCart => showRemoveFromCart && (
        <button onClick={() => onClick(product._id)} className='btn btn-danger'>
            Remove Product
        </button>
    );

    return (
        <div className='card'>
            {redirectCart()}
            {product._id !== undefined ? (
                <img src={`${API}/product/image/${product._id}`} alt={product.name} />
            ) : null}
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>{product.description}</p>
            </div>
            {showViewProductBtn(showViewProduct)}
            {showAddToCartBtn(showAddToCart)}
            {showCartQuantityBtn(showCartQuantity)}
            {showRemoveFromCartBtn(showRemoveFromCart)}
        </div>
    );
};

export default ProductCard;