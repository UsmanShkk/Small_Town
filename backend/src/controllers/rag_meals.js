// const mongoose = require('mongoose');
// const Meal = require('../models/meals'); // Adjust the path as needed
// const axios = require('axios');
// require('dotenv').config();

// const mongoURI = process.env.MONGO_URI; // Replace with your URI

// async function sendAllMealsToRag() {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');

//     // Fetch all meals
//     const allMeals = await Meal.find();

//     for (const meal of allMeals) {
//       const mealData = {
//         id: meal._id.toString(),
//         name: meal.name,
//         description: meal.description,
//         price: meal.price,
//         nutrition: meal.nutrition,
//         allergens: meal.allergens,
//         tags: meal.tags,
//         imageUrl: meal.imageUrl,
//         vendorId: meal.vendorId.toString(),
//       };

//       try {
//         await axios.post('http://localhost:8001/rag/update-meals', mealData);
//         console.log(`Sent meal ${meal._id} to RAG service`);
//       } catch (err) {
//         console.error(`Failed to send meal ${meal._id}:`, err.response?.data || err.message || err);
//       }
//     }

//     // Disconnect from MongoDB after done
//     await mongoose.disconnect();
//     console.log('MongoDB disconnected');
//   } catch (err) {
//     console.error('Error in sending meals:', err.message);
//   }
// }

// sendAllMealsToRag();
