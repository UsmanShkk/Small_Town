const express = require("express");
const router = express.Router();
const { protect, authorizeRoles} = require('../middlewares/authMiddleware');


router.get('/admin-panel', protect, authorizeRoles('Admin'), (req,res)=>{
    res.json({message : "Welcome to admin panel"})
})

router.get('/customer-panel', protect, authorizeRoles('Customer'), (req,res)=>{
    res.json({message : "Welcome to customer panel"})
})

router.get('/delivery-panel', protect, authorizeRoles('Delivery'), (req,res) => {
    res.json({ mesasge : "Welcome dilvery agent"});
    })

router.get('/Chef-panel', protect, authorizeRoles('Chef'), (req,res) => {
    res.json({message : "WElcome chef"});
}
)
module.exports = router;