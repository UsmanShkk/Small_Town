const User = require('../models/user');

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart.meal',
            populate: {
                path: 'vendorId', // Use 'vendorId' not 'vendor'
                select: 'name _id', // Get vendor name and id
                strictPopulate: false // Allow population even if path doesn't exist
            },
            strictPopulate: false
        });
      
        if (!user) return res.status(404).json({ message: 'User not found' });
      
        // Group items by vendor
        const vendorGroups = {};
        let grandTotal = 0;
      
        user.cart.forEach(item => {
            // Check if meal and vendor exist
            if (!item.meal) {
                console.log('Warning: Cart item has no meal reference');
                return;
            }
            
            const price = item.meal.price;
            const lineTotal = price * item.quantity;
            
            // Handle case where vendorId might not be populated
            const vendorId = item.meal.vendorId?._id?.toString() || 'unknown';
            const vendorName = item.meal.vendorId?.name || 'Unknown Vendor';
            
            grandTotal += lineTotal;
            
            // Initialize vendor group if doesn't exist
            if (!vendorGroups[vendorId]) {
                vendorGroups[vendorId] = {
                    vendorId: vendorId,
                    vendorName: vendorName,
                    items: [],
                    vendorTotal: 0
                };
            }
            
            // Add item to vendor group
            vendorGroups[vendorId].items.push({
                mealId: item.meal._id,
                name: item.meal.name,
                price,
                quantity: item.quantity,
                lineTotal
            });
            
            vendorGroups[vendorId].vendorTotal += lineTotal;
        });
      
        // Convert to array format
        const vendors = Object.values(vendorGroups);
      
        res.json({ 
            vendors, 
            grandTotal,
            totalItems: user.cart.length 
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
};

// POST /cart/add
// body: { mealId, quantity }
exports.addToCart = async (req, res) => {
    try {
        const { mealId, quantity } = req.body;
        if (!mealId || quantity <= 0) {
            return res.status(400).json({ message: 'Meal ID and valid quantity required' });
        }
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const existingItem = user.cart.find(item => item.meal.toString() === mealId);
      
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            user.cart.push({ meal: mealId, quantity });
        }
      
        await user.save();
        res.json({ message: 'Meal added to cart', cart: user.cart });
        
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
};
  
// PATCH /cart/update/:mealId
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const { mealId } = req.params;
      
        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }
      
        const user = await User.findById(req.user.id);
        const item = user.cart.find(i => i.meal.toString() === mealId);
      
        if (!item) return res.status(404).json({ message: 'Item not found' });
      
        item.quantity = quantity;
        await user.save();
      
        res.json({ message: 'Quantity updated' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
};
  
// DELETE /cart/remove/:mealId
exports.removeFromCart = async (req, res) => {
    try {
        const { mealId } = req.params;

        await User.findByIdAndUpdate(req.user.id, {
            $pull: { cart: { meal: mealId } }
        });

        res.json({ message: 'Removed from cart' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};

// POST /cart/clear
exports.clearCart = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { cart: [] });
        res.json({ message: 'Cart cleared' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
};