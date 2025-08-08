import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getmealbyId } from '../api';
import { MapPin, AlertTriangle, UtensilsCrossed } from 'lucide-react'; // Optional icons

const MealDetails = () => {
  const { mealId } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await getmealbyId(mealId);
        setMeal(response.data);
      } catch (err) {
        console.error('Error fetching meal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (!meal) return <p className="text-center text-red-600 mt-10">Meal not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6 space-y-6">
      <img
        src={meal.imageUrl}
        alt={meal.name}
        className="w-full h-72 object-cover rounded-xl shadow-sm"
      />

      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{meal.name}</h1>
        <p className="text-green-600 text-2xl font-semibold">Rs. {meal.price}</p>
      </div>

      {meal.description && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Description</h2>
          <p className="text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-md shadow-sm">
            {meal.description}
          </p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Vendor Info</h2>
        <div className="space-y-1 text-gray-700">
          <p><strong>Vendor:</strong> {meal.vendorId?.name}</p>
          {meal.vendorId?.address && (
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{meal.vendorId.address}</span>
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Nutrition Info</h2>
        <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg shadow-sm">
          🍽️ {meal.nutrition.calories} cal | {meal.nutrition.protein}g protein | {meal.nutrition.carbohydrates}g carbs | {meal.nutrition.fat}g fat
        </div>
      </section>

      {meal.allergens?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Allergens
          </h2>
          <p className="text-sm text-gray-700 bg-red-50 p-2 rounded-md shadow-sm">
            {meal.allergens.join(', ')}
          </p>
        </section>
      )}

      {meal.tags?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MealDetails;
