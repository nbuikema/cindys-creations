import React, {useState, useEffect} from 'react';
import {readProduct} from '../api';

import ProductCard from './ProductCard';
import Loader from './Loader';

const Product = ({match}) => {
    const [values, setValues] = useState({
        product: {},
        error: ''
    });
    const {product, error} = values;
    const [loading, setLoading] = useState(true);

    const init = productId => {
        readProduct(productId).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, product: data});
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        init(match.params.productId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    return (
        <div className='container'>
            {showError()}
            {loading ? (
                <Loader />
            ) : (
                <div className='row'>
                    <div className='col-sm-12 col-md-6 mt-3'>
                        <ProductCard product={product} isClickable={false} />
                    </div>
                    <div className='col-sm-12 col-md-6 mt-3'>
                        <h2 className='text-center'>Check Out These Other Products</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;