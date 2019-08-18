import React from 'react';

const ProductCard = ({product}) => {
    const API = process.env.REACT_APP_API_URL;

    return (
        <div className='card'>
            <img src={`${API}/product/image/${product._id}`} alt={product.name} />
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>{product.description}</p>
            </div>
        </div>
    );
};

export default ProductCard;