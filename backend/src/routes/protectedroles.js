const express = require("express");
const router = express.Router();
const { protect, authorizeRoles} = require('../middlewares/authMiddleware');
const userController = require('../controllers/profile')
const userlogout= require('../controllers/authController')
const cart = require('../controllers/cart')

router.get('/admin-panel', protect, authorizeRoles('Admin'), (req,res)=>{
    res.json({message : "Welcome to admin panel"})
})

router.get('/customer-panel', protect, authorizeRoles('Customer'), (req, res) => {
  res.json({ message: "Welcome Customer", success: true, user: req.user });
})

router.get('/profile/get', protect,authorizeRoles('Customer'),userController.getProfile);
router.put('/profile/update', protect,authorizeRoles('Customer') , userController.updateProfile);
router.put('/profile/password', protect,authorizeRoles('Customer'), userController.changePassword);
router.delete('/profile/del', protect,authorizeRoles('Customer'), userController.deleteAccount);
router.post('/logout', protect, authorizeRoles('Customer'),userlogout.logout);
router.get('/get/cart', protect, authorizeRoles('Customer'),cart.getCart);
router.post('/add/cart', protect, authorizeRoles('Customer'),cart.addToCart);
router.patch('/update/item/:mealId', protect, authorizeRoles('Customer'),cart.updateCartItem);
router.delete('/remove/item/:mealId', protect, authorizeRoles('Customer'), cart.removeFromCart);
router.post('/remove/cart',protect,authorizeRoles('Customer'),cart.clearCart);


router.get('/delivery-panel', protect, authorizeRoles('Delivery'), (req,res) => {
    res.json({ mesasge : "Welcome dilvery agent"});
    })

router.get('/Chef-panel', protect, authorizeRoles('Chef'), (req,res) => {
    res.json({message : "WElcome chef"});
}
)
module.exports = router;