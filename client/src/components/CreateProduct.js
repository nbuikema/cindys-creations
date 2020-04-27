import React, {useState, useEffect} from 'react';
import {Redirect} from 'react-router-dom';
import {isAuthenticated, readAllCategories, createProduct} from '../api';

const CreateProduct = () => {
    const [images, setImages] = useState([]);
    const [newProduct, setNewProduct] = useState({
        categories: [],
        name: '',
        description: '',
        category: '',
        price: '',
        error: '',
        formData: '',
        success: false
    });
    const {categories, name, description, price, error, formData, success} = newProduct;
    const {user, token} = isAuthenticated();

    const initCategories = () => {
        readAllCategories().then(data => {
            if(data.error) {
                setNewProduct({...newProduct, error: data.error});
            } else {
                setNewProduct({ ...newProduct, categories: data, formData: new FormData()});
            }
        });
    };

    useEffect(() => {
        initCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = selected => event => {
        setNewProduct({...newProduct, error: '', success: false});
        let value = selected.includes('photos') ? event.target.files[0] : event.target.value;
        if(selected.includes('photos')) {
            let target = selected.split(' ')[1];
            let prop = selected.split(' ')[0];
            if(value === undefined || value.length < 1) {
                images.splice(target, 1, null);
                setImages([...images]);
                let photos = formData.getAll('photos');
                photos.splice(target, 1, null);
                photos.map((photo, i) => {
                    if(i === 0) {
                        return formData.set('photos', photo);
                    } else {
                        return formData.append('photos', photo);
                    }
                });
            } else if(target < images.length) {
                images.splice(target, 1, value);
                setImages([...images]);
                let photos = formData.getAll('photos');
                photos.splice(target, 1, value);
                photos.map((photo, i) => {
                    if(i === 0) {
                        return formData.set('photos', photo);
                    } else {
                        return formData.append('photos', photo);
                    }
                });
            } else {
                setImages([...images, value]);
                formData.append(prop, value);
            }
        } else {
            if(selected === 'available') {
                if(value === 'true') {
                    value = true;
                } else {
                    value = false;
                }
            }
            setNewProduct({...newProduct, [selected]: value});
            formData.set(selected, value);
        }
    };

    const onSubmit = event => {
        event.preventDefault();
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        setNewProduct({...newProduct, error: ''});
        createProduct(user._id, token, formData).then(data => {
            if(data.error) {
                setNewProduct({...newProduct, error: data.error});
            } else {
                setNewProduct({
                    ...newProduct, 
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

    const isFileSelected = i => {
        if(document.getElementsByClassName('input-photos')[i]) {
            let inputIndex = document.getElementsByClassName('input-photos')[i].value;
            return inputIndex.length > 0 ? true : false;
        }
    }

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
            <div className="form-group col-12 row form-row">
                    <label htmlFor='photos' className="col-12 col-form-label"></label>
                    <div className='col-auto'>
                        {isFileSelected(0) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                        <input onChange={onChange('photos 0')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                    </div>
                    {images.length > 0 && (
                        <div className='col-auto'>
                            {isFileSelected(1) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 1')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 1 && (
                        <div className='col-auto'>
                            {isFileSelected(2) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 2')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 2 && (
                        <div className='col-auto'>
                            {isFileSelected(3) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 3')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 3 && (
                        <div className='col-auto'>
                            {isFileSelected(4) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 4')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 4 && (
                        <div className='col-auto'>
                            {isFileSelected(5) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 5')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 5 && (
                        <div className='col-auto'>
                            {isFileSelected(6) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 6')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 6 && (
                        <div className='col-auto'>
                            {isFileSelected(7) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 7')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 7 && (
                        <div className='col-auto'>
                            {isFileSelected(8) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 8')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 8 && (
                        <div className='col-auto'>
                            {isFileSelected(9) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 9')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                    {images.length > 9 && (
                        <div className='col-auto'>
                            {isFileSelected(10) ? <i className="fas fa-check text-success mr-2"></i> : <i className="fas fa-times text-danger mr-2"></i>}
                            <input onChange={onChange('photos 10')} type='file' accept='image/*' className='input-photos mt-1 text-primary' />
                        </div>
                    )}
                </div>
            <div className='text-center mb-3'>
                <button onClick={onSubmit} type='submit' className='btn btn-primary-inverse'>Create Product</button>
            </div>
        </form>
    );

    return (
        <div className='container'>
            <h1 className='text-center mt-3'>Create Product</h1>
            {showError()}
            {redirectSuccess()}
            {createProductForm()}
        </div>
    );
};

export default CreateProduct;