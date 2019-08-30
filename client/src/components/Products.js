import React, { useState, useEffect } from 'react';
import {readAllCategories, readAllProducts, readQueriedProducts} from '../api';

import ProductCard from './ProductCard';
import Loader from './Loader';

const Products = () => {
    const [userFilters, setUserFilters] = useState({
        filters: {
            category: []
        }
    });
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [error, setError] = useState(false);

    const init = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setCategories(data);
                readAllProducts().then(data => {
                    if(data.error) {
                        setError(data.error);
                    } else {
                        setAllProducts(data);
                    }
                });
            }
        });
    };

    useEffect(() => {
        init();
    }, []);

    const handleToggle = c => () => {
        const currentCategory = selectedCategories.indexOf(c);
        const newSelectedCategories = [...selectedCategories];
        if(currentCategory === -1) {
            newSelectedCategories.push(c);
        } else {
            newSelectedCategories.splice(currentCategory, 1);
        }
        setSelectedCategories(newSelectedCategories);
        handleFilters(newSelectedCategories, 'category');
    };

    const handleFilters = (filters, filterBy) => {
        const newFilters = {...userFilters};
        newFilters.filters[filterBy] = filters;
        setUserFilters(newFilters);
        loadFilteredResults(userFilters.filters);
    };

    const loadFilteredResults = newFilters => {
        readQueriedProducts(newFilters).then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setFilteredResults(data);
            }
        });
    };

    const showProducts = () => (
        filteredResults && filteredResults.length > 0 ? (
            <div>
                <h2>Selected Products</h2>
                <div className='row'>
                    {filteredResults.map((product, i) => (
                        <div key={i} className='col-4'>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div>
                <h2>All Products</h2>
                <div className='row'>
                    {allProducts.map((product, i) => (
                        <div key={i} className='col-4'>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        )
    );

    return (
        <div>
            <div className='container'>
                {allProducts.length < 1 || categories.length < 1 ? (
                    <Loader />
                ) : (
                    <div className='row'>
                        <div className='col-4'>
                            <h2>Categories</h2>
                            <ul>
                                {categories.map((category, i) => (
                                    <li key={i}>
                                        <input onChange={handleToggle(category._id)} value={selectedCategories.indexOf(category._id === -1)} type='checkbox' className='form-check-input' />
                                        <label>{category.name}</label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='col-8'>
                            {showProducts()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;