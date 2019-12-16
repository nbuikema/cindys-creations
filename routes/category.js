const express = require('express');
const router = express.Router();

const {categoryById, createCategory, readCategory, updateCategory, deleteCategory, readAllCategories} = require('../controllers/category');
const {isSignedIn, isAuth, isAdmin} = require('../controllers/auth');
const {userById} = require('../controllers/user');

router.post('/category/create/:userId', isSignedIn, isAuth, isAdmin, createCategory);
router.get('/category/read/:categoryId', readCategory);
router.get('/categories/read/all', readAllCategories);
router.put('/category/update/:categoryId/:userId', isSignedIn, isAuth, isAdmin, updateCategory);
router.delete('/category/delete/:categoryId/:userId', isSignedIn, isAuth, isAdmin, deleteCategory);

router.param('categoryId', categoryById);
router.param('userId', userById);

module.exports = router;