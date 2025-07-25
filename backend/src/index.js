require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log(' MongoDB connected locally'))
.catch(err => console.error(' MongoDB connection error:', err));

app.post('/users/new', async (req, res) => {
  try{
    const user = new User(req.body);
    if (user.password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user' });
  }
});

app.get('/users/all', async(req, res) =>{
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch(error){
    res.status(400).json({ message: 'Error fetching users' });
}
});


app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
x
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
});

app.put('/users/update/:id', async(req, res) => {
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
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});