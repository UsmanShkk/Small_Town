import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  fetchVendorMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  authVendor,
} from './../api';

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: '',
    nutrition: {
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: '',
    },
    allergens: '',
    tags: '',
  });
  const [editId, setEditId] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authVendor(); // Sends cookie automatically
        console.log("Vendor authenticated:", res.data);
        loadMeals(); // Only load meals after confirming authentication
      } catch (err) {
        console.log("Vendor not authenticated. Redirecting to login.");
        navigate('/register-vendor'); // 🔒 redirect to login if unauthenticated
      }
    };
  
    checkAuth();
  }, []);
  


  const loadMeals = async () => {
    try {
      const res = await fetchVendorMeals();
      console.log('API returned:', res.data);
      setMeals(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load meals:', err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.nutrition) {
      setForm({
        ...form,
        nutrition: {
          ...form.nutrition,
          [name]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', parseFloat(form.price));
    formData.append('nutrition[calories]', parseFloat(form.nutrition.calories));
    formData.append('nutrition[protein]', parseFloat(form.nutrition.protein));
    formData.append('nutrition[carbohydrates]', parseFloat(form.nutrition.carbohydrates));
    formData.append('nutrition[fat]', parseFloat(form.nutrition.fat));
  
    // ✅ Fix: append each allergen/tag individually
    form.allergens.split(',').forEach(a => formData.append('allergens', a.trim()));
    form.tags.split(',').forEach(t => formData.append('tags', t.trim()));
  
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
  
    try {
      if (editId) {
        await updateMeal(editId, formData);
      } else {
        await createMeal(formData);
      }
  
      // Reset
      setForm({
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        nutrition: {
          calories: '',
          protein: '',
          carbohydrates: '',
          fat: '',
        },
        allergens: '',
        tags: '',
      });
      setSelectedImage(null);
      setEditId(null);
      loadMeals();
    } catch (err) {
      console.error('Meal save failed:', err.message);
    }
  };
  
  

  const handleEdit = (meal) => {
    setEditId(meal._id);
    setForm({
      name: meal.name,
      description: meal.description,
      imageUrl: '', // don't prefill the image field
      price: meal.price,
      nutrition: {
        calories: meal.nutrition.calories,
        protein: meal.nutrition.protein,
        carbohydrates: meal.nutrition.carbohydrates,
        fat: meal.nutrition.fat,
      },
      allergens: meal.allergens.join(', '),
      tags: meal.tags.join(', '),
    });
    setSelectedImage(null); // clear previous selected file
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteMeal(id);
      loadMeals();
    } catch (err) {
      console.error('Delete failed:', err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Meal' : 'Create New Meal'}</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2" required />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="border p-2" required />
        <input type="file" name="image" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} className="border p-2" />
        <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} className="border p-2" />
        <input name="allergens" placeholder="Allergens (comma-separated)" value={form.allergens} onChange={handleChange} className="border p-2" />

        <input name="calories" placeholder="Calories" value={form.nutrition.calories} onChange={handleChange} className="border p-2" required />
        <input name="protein" placeholder="Protein" value={form.nutrition.protein} onChange={handleChange} className="border p-2" required />
        <input name="carbohydrates" placeholder="Carbohydrates" value={form.nutrition.carbohydrates} onChange={handleChange} className="border p-2" required />
        <input name="fat" placeholder="Fat" value={form.nutrition.fat} onChange={handleChange} className="border p-2" required />

        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 md:col-span-2" required />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded md:col-span-2">
          {editId ? 'Update Meal' : 'Add Meal'}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Your Meals</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meals.map((meal) => (
            <tr key={meal._id}>
              <td className="border p-2">{meal.name}</td>
              <td className="border p-2">${meal.price}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => handleEdit(meal)} className="bg-yellow-400 px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(meal._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
