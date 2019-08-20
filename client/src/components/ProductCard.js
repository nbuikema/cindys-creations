import React from 'react';
import {Link} from 'react-router-dom';
const API = process.env.REACT_APP_API_URL;

const ProductCard = ({product, showViewProduct = true}) => {
    const showViewProductBtn = (showViewProduct) => showViewProduct && ( 
        <Link className='btn btn-primary' to={`/product/${product._id}`}>
            View Product
        </Link>
    );

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
                <span className='btn btn-info' style={{cursor: 'pointer'}}>
                    Add to Cart
                </span>
            </div>
        </div>
    );
};

export default ProductCard;