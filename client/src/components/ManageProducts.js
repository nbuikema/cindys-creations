import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {isAuthenticated, readAllCategories, readAllProducts, readQueriedProducts, deleteProduct} from '../api';

import ProductCard from './ProductCard';

const ManageProducts = () => {
    const [myFilters, setMyFilters] = useState({
        filters: {
            category: []
        }
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [allProducts, setAllProducts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const {user, token} = isAuthenticated();

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
            }
        });
    }

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
        const newFilters = {...myFilters};
        newFilters.filters[filterBy] = filters;
        setMyFilters(newFilters);
        loadFilteredResults(myFilters.filters);
    };

    const loadFilteredResults = newFilters => {
        readQueriedProducts(skip, limit, newFilters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults(data);
                setSize(data.size);
                setSkip(0);
            }
        });
    };

    const destroy = productId => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product? This process cannot be undone.');
        if(confirmDelete) {
            deleteProduct(productId, user._id, token).then(data => {
                if(data.error) {
                    console.log(data.error);
                } else {
                    initProducts();
                    loadFilteredResults(myFilters.filters);
                }
            });
        }
    };

    const showProducts = () => (
        selectedCategories && selectedCategories.length > 0 ? (
            <div>
                <h2>Selected Products</h2>
                {filteredResults.map((product, i) => (
                    <div key={i} className='input-group'>
                        <div className='form-control-plaintext' key={i}>{product.name}</div>
                        <span className='input-group-btn'>
                            <div className='btn-group'>
                                <Link className='btn btn-info' to={`/product/update/${product._id}`}>
                                    Update Product
                                </Link>
                                <span onClick={() => destroy(product._id)} className='btn btn-danger' style={{cursor: 'pointer'}}>
                                    Delete Product
                                </span>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <div>
                <h2>All Products</h2>
                {allProducts.map((product, i) => (
                    <div key={i} className='input-group'>
                        <div className='form-control-plaintext' key={i}>{product.name}</div>
                        <span className='input-group-btn'>
                            <div className='btn-group'>
                                <Link className='btn btn-info' to={`/product/update/${product._id}`}>
                                    Update Product
                                </Link>
                                <span onClick={() => destroy(product._id)} className='btn btn-danger' style={{cursor: 'pointer'}}>
                                    Delete Product
                                </span>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        )
    );

    return (
        <div>
            <div className='container'>
                <h2>New Product</h2>
                <Link className='btn btn-primary' to='/product/create'>
                    Create Product
                </Link>
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
            </div>
        </div>
    );
};

export default ManageProducts;