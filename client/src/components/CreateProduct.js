import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {isAuthenticated, readAllCategories, createProduct} from '../api';

const CreateProduct = () => {
    const [values, setValues] = useState({
        categories: [],
        name: '',
        description: '',
        category: '',
        price: '',
        image: '',
        error: '',
        formData: '',
        success: false
    });
    const {categories, name, description, price, error, formData, success} = values;
    const {user, token} = isAuthenticated();

    const initCategories = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({ ...values, categories: data, formData: new FormData()});
            }
        });
    };

    useEffect(() => {
        initCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = valueProp => event => {
        setValues({...values, [valueProp]: event.target.value, error: ''});
        const value = valueProp === 'image' ? event.target.files[0] : event.target.value;
        formData.set(valueProp, value);
        setValues({...values, [valueProp]: value});
    };

    const onSubmit = event => {
        event.preventDefault();
        setValues({...values, error: ''});
        createProduct(user._id, token, formData).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({
                    ...values, 
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    image: '',
                    error: '',
                    formData: '',
                    success: true
                });
            }
        });
    };

    const showError = () => (
        <div className='alert alert-danger' style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const redirectSuccess = () => {
        if(success) {
            return <Redirect to='/manage/products' />;
        }
    };

    const createProductForm = () => (
        <form>
            <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input onChange={onChange('name')} type='text' className='form-control' id='name' aria-describedby='name' value={name} />
            </div>
            <div className='form-group'>
                <label htmlFor='image'>Image</label><br />
                <input onChange={onChange('image')} type='file' accept='image/*' id='image' aria-describedby='image' />
            </div>
            <div className='form-group'>
                <label htmlFor='description'>Description</label>
                <textarea onChange={onChange('description')} className='form-control' id='description' aria-describedby='description' value={description} />
            </div>
            <div className='form-group'>
                <label htmlFor='category'>Category</label>
                <select onChange={onChange('category')} className='form-control'>
                    <option>Select Category</option>
                    {categories && categories.map((category, i) => (
                        <option key={i} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className='form-group'>
                <label htmlFor='price'>Price</label>
                <div className='input-group'>
                    $<input onChange={onChange('price')} type='number' className='form-control' id='price' aria-describedby='price' value={price} />
                </div>
            </div>
            <button onClick={onSubmit} type='submit' className='btn btn-primary'>Create Product</button>
        </form>
    );

    return (
        <div className='container'>
            {showError()}
            {redirectSuccess()}
            {createProductForm()}
        </div>
    );
};

export default CreateProduct;