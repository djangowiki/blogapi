const express = require('express')
const { createCategoryController, fetchAllCategoryController, updateCategoryController, fetchCategoryController, deleteCategoryController } = require('../../controllers/category/category.controller')
const authMiddleware = require('../../middlewares/auth.middleware')

const categoryRouter = express.Router()

categoryRouter.post('/create', authMiddleware, createCategoryController)
categoryRouter.get('/all', authMiddleware, fetchAllCategoryController)
categoryRouter.put('/:categoryId', authMiddleware, updateCategoryController)
categoryRouter.get('/:categoryId', authMiddleware, fetchCategoryController)
categoryRouter.delete('/:categoryId', authMiddleware, deleteCategoryController)

module.exports = categoryRouter