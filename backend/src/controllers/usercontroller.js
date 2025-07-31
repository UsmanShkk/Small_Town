const User = require("../models/user");
const mongoose = require('mongoose');
exports.getall = async(req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch(err) {
      res.status(400).json({ message: "Error Fetching all users" });
    }
  };

  
  
exports.getbyid = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
  
    try {
      const user = await User.findById(id); // Corrected variable name
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user); // Return the user
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  };
  
// isssue in this 
exports.createuser = async(req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  };

  exports.update = async(req, res) => {
    try{
      const {id} = req.params;
      const updates = req.body;
      const updatedUser = await User.findByIdAndUpdate(id, updates,{new: true, runValidators : true});
      if(!updatedUser){
        return res.status(404).json({message: 'User not found'});
      }
      res.status(200).json(updatedUser);
    }catch(error){
      res.status(400).json({message: 'Error updating user'});
    }
  };
  
  exports.deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  };