const asyncHandler = require('../../middlewares/asyncHandler.middleware');
const Category = require('../../models/Category/Category');
const validateID = require('../../utils/validateID');

const createCategoryController =  asyncHandler(async(req, res) => {
 try {
  const category = await Category.create({...req.body, user: req.user.id});
  res.status(201).json(category);
 } catch (error) {
  res.status(500).json(error)
 }

})

const fetchAllCategoryController = asyncHandler(async(req, res) => {
  try {
  const categories = await Category.find();
  res.status(200).json(categories);
  } catch (error) {
    res.status(500).json(error)
  }
})

const updateCategoryController = asyncHandler(async(req, res) => {
  const {categoryId} = req.params
  validateID(categoryId)
  try {
    const category = await Category.findByIdAndUpdate(categoryId, {
      name: req?.body?.name
    }, {new: true})
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error)
  }
})

const fetchCategoryController = asyncHandler(async(req, res) => {
  const {categoryId} = req.params
  try {
    const category = await Category.findById(categoryId)
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json(error)
  }
})

const deleteCategoryController = asyncHandler(async(req, res) => {
  const {categoryId} = req.params
  try {
    const category = await Category.findByIdAndRemove(categoryId)
    res.status(200).json(category);
    } catch (error) {
    res.status(500).json(error)
    }
})



module.exports = {
    createCategoryController,
    fetchAllCategoryController,
    updateCategoryController, 
    fetchCategoryController, 
    deleteCategoryController
  }
