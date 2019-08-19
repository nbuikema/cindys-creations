import React, { useState, useEffect } from 'react';
import {readAllProducts} from '../api';

import ProductCard from './ProductCard';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');

    const init = () => {
        readAllProducts().then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setProducts(data);
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <div>
            <div className='container'>
                <div className='col-8'>
                    <h2 className='mb-4'>Products</h2>
                    <div className='row'>
                        {products.map((product, i) => (
                            <div key={i} className='col-4 mb-3'>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;