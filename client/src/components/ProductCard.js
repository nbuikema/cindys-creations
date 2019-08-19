import React from 'react';
import {Link} from 'react-router-dom';
import {isAuthenticated} from '../api';
const API = process.env.REACT_APP_API_URL;

const ProductCard = ({product}) => {
    const showAdminButtons = () => (
        isAuthenticated() && isAuthenticated().user.role === 1 ? (
            <div className='btn-group'>
                <Link className='btn btn-info' to={`/product/update/${product._id}`}>
                    Update Product
                </Link>
                <span className='btn btn-danger' style={{cursor: 'pointer'}}>
                    Delete Product
                </span>
            </div>
        ) : ''
    );

    return (
        <div className='card'>
            <img src={`${API}/product/image/${product._id}`} alt={product.name} />
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-text'>{product.description}</p>
            </div>
            {showAdminButtons()}
        </div>
    );
};

export default ProductCard;