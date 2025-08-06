// routes/mealRoutes.js
const express = require('express');
const router = express.Router();

const {
  createMeal,
  getMeals,
  getAllMeals,
  getMealById,
  updateMeal,
  deleteMeal
} = require('../controllers/mealcontroller');

const {
  protectVendor,
  restrictToVendor
} = require('../middlewares/vendormealmiddleware');

const upload  =  require('../middlewares/image');


router.post(
  '/vendor-meals-create',
  protectVendor,
  restrictToVendor,
  upload.single('image'),  
  createMeal
);


router.put(
  '/vendor-meals-new/:id',
  protectVendor,
  restrictToVendor,
  upload.single('image'),
  updateMeal
);


router.get('/vendor-meals', protectVendor, restrictToVendor, getMeals);


router.get('/vendor-meals/:id', protectVendor, restrictToVendor, getMealById);


router.delete('/vendor-meals-delete/:id', protectVendor, restrictToVendor, deleteMeal);

router.get('/meals', getAllMeals);

module.exports = router;
