import React, { useState, useEffect } from 'react';
import {readAllCategories, readProductsByName, readAllProducts, readQueriedProducts} from '../api';

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
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const initCategories = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        });
    };

    const initProducts = () => {
        readAllProducts().then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setAllProducts(data);
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        initCategories();
        initProducts();
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
        if(newFilters.filters.category.length === 0) {
            initProducts();
        } else {
            loadFilteredResults(userFilters.filters);
        }
    };

    const loadFilteredResults = newFilters => {
        readQueriedProducts(newFilters).then(data => {
            if(data.error) {
                setError(data.error);
            } else {
                setAllProducts(data);
            }
        });
    };

    const showProducts = () => (
        <div>
            {selectedCategories.length > 0 || searching ? (
                <h2>Showing Found Products</h2>
            ) : (
                <h2>Showing All Products</h2>
            )}
            <div className='row products'>
                {allProducts.map((product, i) => (
                    <div key={i} className='col-xs-12 col-sm-6 col-lg-4 mb-3'>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );

    const onSearchChange = event => {
        if(event.target.value.length === 0) {
            setSearching(false);
            initProducts();
        } else {
            readProductsByName(event.target.value).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    setSearching(true);
                    setAllProducts(data);
                }
            });
        }
    };

    return (
        <div>
            <div className='container'>
                {loading ? (
                    <Loader />
                ) : (
                    <div className='row mt-3'>
                        <div className='col-sm-12 col-md-3'>
                            <a data-toggle='collapse' href='#collapseFilters' role='button' aria-expanded='false' aria-controls='collapseFilters'>
                                <h2>Toggle Search Filters</h2>
                            </a>
                            <div className='collapse' id='collapseFilters'>
                                <h2>Filter By</h2>
                                <div className='ml-4'>
                                    <h4>Name</h4>
                                    <div className='form-group'>
                                        <input onChange={onSearchChange} type='text' className='form-control' id='searchProducts' aria-describedby='searchProducts' placeholder='Search products...' />
                                    </div>
                                    <h4>Category</h4>
                                    <ul>
                                        {categories.map((category, i) => (
                                            <li key={i}>
                                                <input onChange={handleToggle(category._id)} value={selectedCategories.indexOf(category._id === -1)} type='checkbox' className='form-check-input' />
                                                <label>{category.name}</label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-12 col-md-9 mt-3'>
                            {showProducts()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;