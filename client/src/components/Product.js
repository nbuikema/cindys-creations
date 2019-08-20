import React, {useState, useEffect} from 'react';
import {readProduct} from '../api';

import ProductCard from './ProductCard';

const Product = ({match}) => {
    const [values, setValues] = useState({
        product: {},
        error: ''
    });
    const {product, error} = values;

    const init = productId => {
        readProduct(productId).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, product: data});
            }
        });
    };

    useEffect(() => {
        init(match.params.productId);
    }, []);

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    return (
        <div className='container'>
            {showError()}
            <ProductCard product={product} showViewProduct={false} />
        </div>
    );
};

export default Product;