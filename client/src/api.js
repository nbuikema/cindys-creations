const jwtDecode = require('jwt-decode');
const API = process.env.REACT_APP_API_URL;

export const signup = user => {
    return fetch(`${API}/auth/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};

export const signin = user => {
    return fetch(`${API}/auth/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};

export const authenticate = (data, next) => {
    if(typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};

export const signout = next => {
    if(typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        next();
        return fetch(`${API}/auth/signout`, {
            method: 'GET'
        }).then(response => {}).catch(err => {
            console.log(err)
        });
    }
};

export const isAuthenticated = () => {
    if(typeof window === 'undefined') {
        return false;
    }
    if(localStorage.getItem('jwt')) {
        const token = localStorage.getItem('jwt');
        const {exp} = jwtDecode(token);
        const curTime = Date.now() / 1000;
        if(exp > curTime) {
            return JSON.parse(token);
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export const readUser = (userId, token) => {
    return fetch(`${API}/user/read/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const updateUser = (userId, token, user) => {
    return fetch(`${API}/user/update/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const update = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

export const deleteUser = (userId, token) => {
    return fetch(`${API}/user/delete/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const readAllProducts = () => {
    return fetch(`${API}/products/read/all`, {
        method: 'GET'
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const readQueriedProducts = (skip, limit, filters = {}) => {
    const data = {limit, skip, filters};
    return fetch(`${API}/products/read/query`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => {
            console.log(err);
        });
};

export const readAllCategories = () => {
    return fetch(`${API}/categories/read/all`, {
        method: 'GET'
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const deleteCategory = (categoryId, userId, token) => {
    return fetch(`${API}/category/delete/${categoryId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const createCategory = (userId, token, category) => {
    return fetch(`${API}/category/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};

export const createProduct = (userId, token, product) => {
    return fetch(`${API}/product/create/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};

export const readProduct = productId => {
    return fetch(`${API}/product/read/${productId}`, {
        method: 'GET'
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const updateProduct = (userId, token, productId, product) => {
    return fetch(`${API}/product/update/${productId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: product
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
};

export const deleteProduct = (productId, userId, token) => {
    return fetch(`${API}/product/delete/${productId}/${userId}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};