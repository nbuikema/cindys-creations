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
    const [searchTerm, setSearchTerm] = useState('');
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
        setSearchTerm('');
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
            <div className='row'>
                {allProducts.map((product, i) => (
                    <div key={i} className='col-xs-12 col-sm-6 col-md-4 col-xl-3 mb-4'>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );

    const toggleFiltersOff = () => {
        const filtersArray = document.getElementsByName('filters');
        filtersArray.forEach(filter => {
            if(filter.checked) {
                filter.checked = false;
            }
        })
    }

    const onSearchChange = event => {
        const search = event.target.value;
        if(search.length === 0) {
            setSearchTerm('');
            setSearching(false);
            initProducts();
        } else {
            readProductsByName(event.target.value).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    const clearFilters = {...userFilters};
                    clearFilters.filters.category = [];
                    setUserFilters(clearFilters);
                    setSelectedCategories([]);
                    toggleFiltersOff();
                    setSearchTerm(search);
                    setSearching(true);
                    setAllProducts(data);
                }
            });
        }
    };

    return (
        <div>
            <div className='container mb-3'>
                <h1 className='text-center mt-3'>My Creations</h1>
                {selectedCategories.length > 0 || searchTerm.length !== 0 ? (
                    <h4 className={`text-center ${loading ? 'd-none' : ''}`}>Showing {`${allProducts.length}`} Found Products</h4>
                ) : (
                    <h4 className={`text-center ${loading ? 'd-none' : ''}`}>Showing All Products</h4>
                )}
                {loading ? (
                    <Loader />
                ) : (
                    <div className='row mt-3'>
                        <div className='col-md-12 col-lg-3'>
                            <a className='d-lg-none' data-toggle='collapse' href='#collapseFilters' role='button' aria-expanded='false' aria-controls='collapseFilters'>
                                <h4 className='text-center'>Toggle Search Filters</h4>
                            </a>
                            <div className='collapse d-lg-block' id='collapseFilters'>
                                <h4>Filter By</h4>
                                <div className='ml-3'>
                                    <h5>Name</h5>
                                    <div className='form-group mr-3'>
                                        <input onChange={onSearchChange} value={searchTerm} type='text' className='form-control ml-3' id='searchProducts' aria-describedby='searchProducts' placeholder='Search products...' />
                                    </div>
                                    <h5>Category</h5>
                                    <ul className='list-group'>
                                        {categories.map((category, i) => (
                                            <li className='list-group-item ml-3' key={i}>
                                                <span><h6 className='d-inline text-down'>{category.name}</h6></span>
                                                <label className='switch'>
                                                    <input onChange={handleToggle(category._id)} value={selectedCategories.indexOf(category._id === -1)} name='filters' type='checkbox' className='primary' />
                                                    <span className='slider'></span>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-12 col-lg-9 mt-3'>
                            {showProducts()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;