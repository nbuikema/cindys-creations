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
        if(typeof window !== 'undefined') {
            sessionStorage.removeItem('cart');
        }
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
        localStorage.removeItem('cart');
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

export const readQueriedProducts = (filters = {}) => {
    const data = {filters};
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

export const addProductToCart = (item, next) => {
    let cart = [];
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.push({...item, count: 1});
            cart = Array.from(new Set(cart.map(product => product._id))).map(id => {
                return cart.find(product => product._id === id);
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            next();
        } else {
            if(sessionStorage.getItem('cart')) {
                cart = JSON.parse(sessionStorage.getItem('cart'));
            }
            cart.push({...item, count: 1});
            cart = Array.from(new Set(cart.map(product => product._id))).map(id => {
                return cart.find(product => product._id === id);
            });
            sessionStorage.setItem('cart', JSON.stringify(cart));
            next();
        }
    }
};

export const numItemsInCart = () => {
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            if(localStorage.getItem('cart')) {
                return JSON.parse(localStorage.getItem('cart')).length;
            }
        } else {
            if(sessionStorage.getItem('cart')) {
                return JSON.parse(sessionStorage.getItem('cart')).length;
            }
        }
    }
    return 0;
};

export const readCart = () => {
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            if(localStorage.getItem('cart')) {
                return JSON.parse(localStorage.getItem('cart'));
            }
        } else {
            if(sessionStorage.getItem('cart')) {
                return JSON.parse(sessionStorage.getItem('cart'));
            }
        }
    }
    return [];
};

export const updateQuantity = (productId, count) => {
    let cart = [];
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.forEach((product, i) => {
                if(product._id === productId) {
                    cart[i].count = count;
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            if(sessionStorage.getItem('cart')) {
                cart = JSON.parse(sessionStorage.getItem('cart'));
            }
            cart.forEach((product, i) => {
                if(product._id === productId) {
                    cart[i].count = count;
                }
            });
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    }
};

export const removeProductFromCart = productId => {
    let cart = [];
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            if(localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.forEach((product, i) => {
                if(product._id === productId) {
                    cart.splice(i, 1);
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            if(sessionStorage.getItem('cart')) {
                cart = JSON.parse(sessionStorage.getItem('cart'));
            }
            cart.forEach((product, i) => {
                if(product._id === productId) {
                    cart.splice(i, 1);
                }
            });
            sessionStorage.setItem('cart', JSON.stringify(cart));
        }
    }
    return cart;
};

export const getClientToken = () => {
    return fetch(`${API}/braintree/token`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const processPayment = paymentData => {
    return fetch(`${API}/braintree/payment`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const clearCart = (next) => {
    if(typeof window !== 'undefined') {
        if(isAuthenticated()) {
            localStorage.removeItem('cart');
        }
        else {
            sessionStorage.removeItem('cart');
        }
        next();
    }
};

export const createOrder = (order) => {
    return fetch(`${API}/order/create`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const readAllOrders = (userId, token) => {
    return fetch(`${API}/orders/read/all/${userId}`, {
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

export const readOrderStatusValues = (userId, token) => {
    return fetch(`${API}/order/status/values/${userId}`, {
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

export const updateOrderStatus = (userId, token, orderId, status) => {
    return fetch(`${API}/order/status/update/${orderId}/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({status, orderId})
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};

export const readOrderHistory = (userId, token) => {
    return fetch(`${API}/user/read/orders/${userId}`, {
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

export const readOrdersByEmail = (orderEmail) => {
    return fetch(`${API}/orders/read/email/${orderEmail}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err)
    });
};