import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {isAuthenticated, readAllCategories, readProduct, updateProduct} from '../api';

import Loader from './Loader';

const UpdateProduct = ({match}) => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        image: '',
        error: '',
        formData: '',
        success: false
    });
    const [categories, setCategories] = useState([]);
    const {name, description, price, error, formData, success} = values;
    const [loading, setLoading] = useState(true);
    
    const {user, token} = isAuthenticated();

    const initCategories = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setCategories(data);
            }
        });
    };

    const initProduct = productId => {
        readProduct(productId).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    formData: new FormData()
                });
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        initProduct(match.params.productId);
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
        updateProduct(user._id, token, match.params.productId, formData).then(data => {
            if(data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({
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

    const updateProductForm = () => (
        <form>
            <div className='form-group'>
                <label htmlFor='name'>Name</label>
                <input onChange={onChange('name')} type='text' className='form-control' id='name' aria-describedby='name' placeholder={name} />
            </div>
            <div className='form-group'>
                <label htmlFor='image'>Image</label><br />
                <input onChange={onChange('image')} type='file' accept='image/*' id='image' aria-describedby='image' />
            </div>
            <div className='form-group'>
                <label htmlFor='description'>Description</label>
                <textarea onChange={onChange('description')} className='form-control' id='description' aria-describedby='description' placeholder={description} />
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
                    $<input onChange={onChange('price')} type='number' className='form-control' id='price' aria-describedby='price' placeholder={price} />
                </div>
            </div>
            <div className='text-center mb-3'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary-inverse'>Save Changes</button>
            </div>
        </form>
    );

    return (
        <div className='container'>
            <h1 className='text-center mt-3'>Update Product</h1>
            {showError()}
            {redirectSuccess()}
            {loading ? (
                <Loader />
            ) : (
                <div>
                    {updateProductForm()}
                </div>
            )}
        </div>
    );
};

export default UpdateProduct;