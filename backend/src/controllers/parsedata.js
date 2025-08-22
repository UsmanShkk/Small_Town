const MealPlan = require("../models/parsedmeals");

exports.saveMealPlan = async (req, res) => {
  try {
    const userId = req.body.userID;
    const rawData = req.body.data;

    // Parse raw string into structured plan
    const structuredPlans = parseMealPlan(rawData);

    if (structuredPlans.length !== 7) {
      return res.status(400).json({ message: "❌ Meal plan must contain 7 days" });
    }

    // remove old plan if already exists
    await MealPlan.findOneAndDelete({ userId });

    const newMealPlan = new MealPlan({
      userId,
      plans: structuredPlans
    });

    await newMealPlan.save();
    res.json({ message: "✅ Meal plan saved", mealPlan: newMealPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error saving meal plan", error: err.message });
  }
};
function parseMealPlan(raw) {
  // Split on "Day x:" headings
  const days = raw.split(/Day \d+:/).filter(Boolean);

  return days.map((dayBlock, index) => {
    const meals = [];
    const mealSections = dayBlock.trim().split(/\n\n/);

    mealSections.forEach(section => {
      const lines = section.split("\n").map(l => l.trim());

      if (lines.length >= 4) {
        const [mealTypeLine, caloriesLine, tagsLine, mealIdLine] = lines;

        // Meal type & name/description
        const [mealType, nameDesc] = mealTypeLine.split("—").map(s => s.trim());
        const [name, description] = nameDesc.split(":").map(s => s.trim());

        // Nutrition
        const nutrition = {};
        caloriesLine.split("|").forEach(part => {
          const [key, value] = part.split(":").map(s => s.trim());
          if (key && value) nutrition[key.toLowerCase()] = value;
        });

        // Tags
        const tags = tagsLine.replace(/^Tags:/i, "").split(",").map(t => t.trim());

        // Meal ID
        const mealId = mealIdLine.replace(/^Meal ID:/i, "").trim();

        meals.push({
          mealType,
          name,
          description,
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          tags,
          mealId
        });
      }
    });

    return { day: index + 1, meals };
  });
}



const mongoose = require("mongoose");

exports.getMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    // validate objectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "❌ Invalid userId format" });
    }

    const mealPlan = await MealPlan.findOne({ userId: new mongoose.Types.ObjectId(userId) }).lean();

    if (!mealPlan) {
      return res.status(404).json({ message: "❌ No meal plan found for this user" });
    }

    // normalize days & meals (your existing logic)
    const normalizedPlans = Array.from({ length: 7 }, (_, i) => {
      const dayData = mealPlan.plans.find(p => p.day === i + 1);
      return {
        day: i + 1,
        meals: ["Breakfast", "Lunch", "Dinner"].map(mealType => {
          const meal = dayData?.meals.find(m => m.mealType === mealType);
          return meal || {
            mealType,
            name: "",
            description: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
            tags: [],
            mealId: ""
          };
        })
      };
    });

    res.json({
      message: "✅ Meal plan fetched",
      userId: mealPlan.userId,
      plans: normalizedPlans,
      createdAt: mealPlan.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Error fetching meal plan", error: err.message });
  }
};
