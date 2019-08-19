import React, { useState, useEffect } from 'react';
import {isAuthenticated, readAllCategories, deleteCategory, createCategory} from '../api';

const ManageCategories = () => {
    const [values, setValues] = useState({
        categories: [],
        name: '',
        error: ''
    });
    const {categories, name, error} = values;

    const {user, token} = isAuthenticated();

    const init = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, name: '', error: '', categories: data});
            }
        });
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const destroy = categoryId => {
        const confirmDelete = window.confirm('Are you sure you want to delete this category? This process cannot be undone.');
        if(confirmDelete) {
            deleteCategory(categoryId, user._id, token).then(data => {
                if(data.error) {
                    setValues({...values, error: data.error});
                } else {
                    init();
                }
            });
        }
    };

    const onChange = event => {
        setValues({...values, name: event.target.value});
    };

    const onSubmit = event => {
        event.preventDefault();
        createCategory(user._id, token, { name }).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, name: ''});
                init();
            }
        });
    };

    const newCategoryForm = () => (
        <div className='input-group'>
            <input onChange={onChange} type='text' className='form-control-plaintext' value={name} />
            <span className='input-group-btn'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary'>Create Category</button>
            </span>
        </div>
    );

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    return (
        <div>
            <div className='container'>
                {showError()}
                {newCategoryForm()}
                <div>
                    <h2>Categories</h2>
                    {categories.map((category, i) => (
                        <div key={i} className='input-group'>
                            <div className='form-control-plaintext' key={i}>{category.name}</div>
                            <span className='input-group-btn'>
                                <button onClick={() => destroy(category._id)} type='submit' className='btn btn-danger'>Delete Category</button>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageCategories;