import React from 'react';
import {Link} from 'react-router-dom';
import {addProductToCart} from '../api';
const API = process.env.REACT_APP_API_URL;

const ProductCard = ({product, showViewProduct = true}) => {
    const showViewProductBtn = (showViewProduct) => showViewProduct && ( 
        <Link className='btn btn-primary' to={`/product/${product._id}`}>
            View Product
        </Link>
    );

    const addToCart = () => {
        addProductToCart(product, () => {
            console.log(product);
        });
    };

    return (
        <div className='card'>
            {product._id !== undefined ? (
                <img src={`${API}/product/image/${product._id}`} alt={product.name} />
            ) : ''}
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>{product.description}</p>
            </div>
            <div className='btn-group'>
                {showViewProductBtn(showViewProduct)}
                <button onClick={addToCart} className='btn btn-info'>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;