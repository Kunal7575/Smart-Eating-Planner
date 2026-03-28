const JSON_FILE = "FoodData_Central_foundation_food_json_2025-12-18.json";

let foundationFoods = [];
let latestPlanText = "No plan generated yet.";

// Label maps for consistent display
const GOAL_LABELS = {
  balanced: "Balanced Eating",
  highProtein: "High Protein",
  weightLoss: "Weight Loss",
  budget: "Lowest Cost"
};

const DIET_LABELS = {
  all: "No Restriction",
  vegetarian: "Vegetarian"
};

/*
  Curated grocery catalog.
  These are real, normal foods people actually buy.
  price = estimated price per serving in CAD
  qtyLabel = amount used in grocery list
*/
const FOOD_CATALOG = [
  {
    id: "oats",
    name: "Oats",
    category: "breakfast",
    vegetarian: true,
    price: 0.45,
    qtyLabel: "1 serving oats",
    matchTerms: ["oats"],
    fallback: { calories: 150, protein: 5, carbs: 27, fat: 3, fiber: 4, sodium: 2 }
  },
  {
    id: "banana",
    name: "Banana",
    category: "fruit",
    vegetarian: true,
    price: 0.40,
    qtyLabel: "1 banana",
    matchTerms: ["banana"],
    fallback: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sodium: 1 }
  },
  {
    id: "apple",
    name: "Apple",
    category: "fruit",
    vegetarian: true,
    price: 0.75,
    qtyLabel: "1 apple",
    matchTerms: ["apple, raw"],
    fallback: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sodium: 2 }
  },
  {
    id: "eggs",
    name: "Eggs",
    category: "protein",
    vegetarian: true,
    price: 0.80,
    qtyLabel: "2 eggs",
    matchTerms: ["egg, whole"],
    fallback: { calories: 140, protein: 12, carbs: 1, fat: 10, fiber: 0, sodium: 140 }
  },
  {
    id: "greekYogurt",
    name: "Greek Yogurt",
    category: "protein",
    vegetarian: true,
    price: 1.35,
    qtyLabel: "1 yogurt serving",
    matchTerms: ["yogurt, greek", "greek yogurt"],
    fallback: { calories: 120, protein: 17, carbs: 6, fat: 0, fiber: 0, sodium: 55 }
  },
  {
    id: "milk",
    name: "Milk",
    category: "dairy",
    vegetarian: true,
    price: 0.60,
    qtyLabel: "1 cup milk",
    matchTerms: ["milk"],
    fallback: { calories: 120, protein: 8, carbs: 12, fat: 5, fiber: 0, sodium: 100 }
  },
  {
    id: "bread",
    name: "Bread",
    category: "carb",
    vegetarian: true,
    price: 0.50,
    qtyLabel: "2 slices bread",
    matchTerms: ["bread"],
    fallback: { calories: 160, protein: 6, carbs: 30, fat: 2, fiber: 3, sodium: 250 }
  },
  {
    id: "peanutButter",
    name: "Peanut Butter",
    category: "protein",
    vegetarian: true,
    price: 0.55,
    qtyLabel: "2 tbsp peanut butter",
    matchTerms: ["peanut butter"],
    fallback: { calories: 190, protein: 8, carbs: 7, fat: 16, fiber: 2, sodium: 140 }
  },
  {
    id: "rice",
    name: "Rice",
    category: "carb",
    vegetarian: true,
    price: 0.55,
    qtyLabel: "1 serving rice",
    matchTerms: ["rice, white", "rice, brown"],
    fallback: { calories: 205, protein: 4, carbs: 45, fat: 0.4, fiber: 0.6, sodium: 2 }
  },
  {
    id: "pasta",
    name: "Pasta",
    category: "carb",
    vegetarian: true,
    price: 0.70,
    qtyLabel: "1 serving pasta",
    matchTerms: ["pasta"],
    fallback: { calories: 210, protein: 7, carbs: 42, fat: 1.3, fiber: 2.5, sodium: 5 }
  },
  {
    id: "chicken",
    name: "Chicken Breast",
    category: "protein",
    vegetarian: false,
    price: 2.75,
    qtyLabel: "1 serving chicken",
    matchTerms: ["chicken, broilers", "chicken breast"],
    fallback: { calories: 180, protein: 34, carbs: 0, fat: 4, fiber: 0, sodium: 80 }
  },
  {
    id: "tuna",
    name: "Tuna",
    category: "protein",
    vegetarian: false,
    price: 1.80,
    qtyLabel: "1 tuna serving",
    matchTerms: ["tuna"],
    fallback: { calories: 120, protein: 26, carbs: 0, fat: 1, fiber: 0, sodium: 280 }
  },
  {
    id: "beans",
    name: "Beans",
    category: "protein",
    vegetarian: true,
    price: 0.80,
    qtyLabel: "1 serving beans",
    matchTerms: ["beans, black", "beans, pinto", "kidney beans"],
    fallback: { calories: 140, protein: 9, carbs: 25, fat: 0.5, fiber: 8, sodium: 8 }
  },
  {
    id: "lentils",
    name: "Lentils",
    category: "protein",
    vegetarian: true,
    price: 0.90,
    qtyLabel: "1 serving lentils",
    matchTerms: ["lentils"],
    fallback: { calories: 180, protein: 13, carbs: 31, fat: 1, fiber: 11, sodium: 6 }
  },
  {
    id: "potato",
    name: "Potatoes",
    category: "carb",
    vegetarian: true,
    price: 0.60,
    qtyLabel: "1 potato serving",
    matchTerms: ["potato"],
    fallback: { calories: 160, protein: 4, carbs: 37, fat: 0.2, fiber: 4, sodium: 10 }
  },
  {
    id: "spinach",
    name: "Spinach",
    category: "vegetable",
    vegetarian: true,
    price: 0.90,
    qtyLabel: "1 serving spinach",
    matchTerms: ["spinach"],
    fallback: { calories: 20, protein: 2.5, carbs: 3, fat: 0.3, fiber: 2, sodium: 24 }
  },
  {
    id: "tomato",
    name: "Tomatoes",
    category: "vegetable",
    vegetarian: true,
    price: 0.80,
    qtyLabel: "1 serving tomatoes",
    matchTerms: ["tomatoes, grape", "tomato"],
    fallback: { calories: 25, protein: 1.1, carbs: 5, fat: 0.2, fiber: 1.5, sodium: 6 }
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "vegetable",
    vegetarian: true,
    price: 0.95,
    qtyLabel: "1 serving broccoli",
    matchTerms: ["broccoli"],
    fallback: { calories: 35, protein: 2.4, carbs: 7, fat: 0.4, fiber: 3, sodium: 30 }
  },
  {
    id: "cheese",
    name: "Cheese",
    category: "dairy",
    vegetarian: true,
    price: 0.85,
    qtyLabel: "1 cheese serving",
    matchTerms: ["cheese, cheddar", "cheese"],
    fallback: { calories: 110, protein: 7, carbs: 1, fat: 9, fiber: 0, sodium: 180 }
  },
  {
    id: "onion",
    name: "Onion",
    category: "vegetable",
    vegetarian: true,
    price: 0.35,
    qtyLabel: "1 onion serving",
    matchTerms: ["onion"],
    fallback: { calories: 30, protein: 0.8, carbs: 7, fat: 0.1, fiber: 1.5, sodium: 3 }
  }
];

const MEAL_TEMPLATES = [
  {
    name: "Oatmeal with Banana",
    type: "Breakfast",
    foods: ["oats", "banana", "milk"]
  },
  {
    name: "Eggs and Toast",
    type: "Breakfast",
    foods: ["eggs", "bread"]
  },
  {
    name: "Greek Yogurt and Fruit",
    type: "Breakfast",
    foods: ["greekYogurt", "banana", "apple"]
  },
  {
    name: "Peanut Butter Toast",
    type: "Breakfast",
    foods: ["bread", "peanutButter", "banana"]
  },
  {
    name: "Rice, Chicken and Broccoli",
    type: "Lunch",
    foods: ["rice", "chicken", "broccoli"]
  },
  {
    name: "Rice and Beans Bowl",
    type: "Lunch",
    foods: ["rice", "beans", "tomato", "onion"]
  },
  {
    name: "Lentils and Rice",
    type: "Lunch",
    foods: ["lentils", "rice", "spinach"]
  },
  {
    name: "Tuna Sandwich",
    type: "Lunch",
    foods: ["tuna", "bread", "tomato"]
  },
  {
    name: "Pasta with Tomato and Cheese",
    type: "Dinner",
    foods: ["pasta", "tomato", "cheese"]
  },
  {
    name: "Chicken, Potatoes and Spinach",
    type: "Dinner",
    foods: ["chicken", "potato", "spinach"]
  },
  {
    name: "Beans and Potatoes",
    type: "Dinner",
    foods: ["beans", "potato", "broccoli"]
  },
  {
    name: "Lentil Bowl",
    type: "Dinner",
    foods: ["lentils", "tomato", "onion", "rice"]
  }
];

function safeNumber(value) {
  return typeof value === "number" && !isNaN(value) ? value : 0;
}

function findNutrient(food, nutrientName) {
  const item = food.foodNutrients?.find(
    (n) => n.nutrient?.name?.toLowerCase() === nutrientName.toLowerCase()
  );
  return safeNumber(item?.amount);
}

function getMatchedFoundationFood(matchTerms) {
  if (!foundationFoods.length) return null;

  for (const term of matchTerms) {
    const found = foundationFoods.find((food) =>
      (food.description || "").toLowerCase().includes(term.toLowerCase())
    );
    if (found) return found;
  }

  return null;
}

function getFoodNutritionFromJsonOrFallback(catalogFood) {
  const matched = getMatchedFoundationFood(catalogFood.matchTerms);

  if (!matched) {
    return {
      ...catalogFood.fallback,
      matchedDescription: "Fallback nutrition used"
    };
  }

  const calories =
    findNutrient(matched, "Energy") ||
    catalogFood.fallback.calories;

  const protein =
    findNutrient(matched, "Protein") ||
    catalogFood.fallback.protein;

  const carbs =
    findNutrient(matched, "Carbohydrate, by difference") ||
    findNutrient(matched, "Carbohydrate, by summation") ||
    catalogFood.fallback.carbs;

  const fat =
    findNutrient(matched, "Total lipid (fat)") ||
    catalogFood.fallback.fat;

  const fiber =
    findNutrient(matched, "Fiber, total dietary") ||
    catalogFood.fallback.fiber;

  const sodium =
    findNutrient(matched, "Sodium, Na") ||
    catalogFood.fallback.sodium;

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    sodium,
    matchedDescription: matched.description
  };
}

function buildFoodMap() {
  const map = {};

  for (const item of FOOD_CATALOG) {
    const nutrition = getFoodNutritionFromJsonOrFallback(item);
    map[item.id] = {
      ...item,
      ...nutrition
    };
  }

  return map;
}

function mealTotals(template, foodMap) {
  return template.foods.reduce(
    (acc, foodId) => {
      const food = foodMap[foodId];
      if (!food) return acc;

      acc.cost += food.price;
      acc.calories += food.calories;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fat += food.fat;
      acc.fiber += food.fiber;
      acc.sodium += food.sodium;
      return acc;
    },
    {
      cost: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    }
  );
}

function scoreMeal(template, totals, goal) {
  let score = 0;

  if (goal === "highProtein") {
    score += totals.protein * 5;
    score += totals.fiber * 2;
    score -= totals.cost * 1.2;
    score -= totals.sodium * 0.005;
  }

  if (goal === "weightLoss") {
    score += totals.protein * 4;
    score += totals.fiber * 4;
    score -= totals.calories * 0.02;
    score -= totals.cost * 0.8;
  }

  if (goal === "budget") {
    score += totals.protein * 2;
    score += totals.fiber * 1.5;
    score -= totals.cost * 6;
  }

  if (goal === "balanced") {
    score += totals.protein * 3;
    score += totals.fiber * 2;
    score -= totals.cost * 1.5;
    score -= totals.sodium * 0.003;
  }

  return score;
}

function filterTemplates(diet) {
  if (diet === "all") return MEAL_TEMPLATES;

  if (diet === "vegetarian") {
    return MEAL_TEMPLATES.filter((meal) =>
      meal.foods.every((foodId) => {
        const item = FOOD_CATALOG.find((f) => f.id === foodId);
        return item?.vegetarian;
      })
    );
  }

  return MEAL_TEMPLATES;
}

function pickBestMealByType(type, templates, foodMap, goal, usedMealNames) {
  const candidates = templates
    .filter((meal) => meal.type === type)
    .map((meal) => {
      const totals = mealTotals(meal, foodMap);
      return {
        ...meal,
        totals,
        score: scoreMeal(meal, totals, goal)
      };
    })
    .sort((a, b) => b.score - a.score);

  const unused = candidates.find((c) => !usedMealNames.has(c.name));
  return unused || candidates[0] || null;
}

function generateWeeklyPlan(days, goal, diet, proteinTarget) {
  const foodMap = buildFoodMap();
  const templates = filterTemplates(diet);
  const usedMealNames = new Set();
  const week = [];

  for (let i = 1; i <= days; i++) {
    const breakfast = pickBestMealByType("Breakfast", templates, foodMap, goal, usedMealNames);
    if (breakfast) usedMealNames.add(breakfast.name);

    const lunch = pickBestMealByType("Lunch", templates, foodMap, goal, usedMealNames);
    if (lunch) usedMealNames.add(lunch.name);

    const dinner = pickBestMealByType("Dinner", templates, foodMap, goal, usedMealNames);
    if (dinner) usedMealNames.add(dinner.name);

    const dayMeals = [breakfast, lunch, dinner].filter(Boolean);
    const dailyTotals = dayMeals.reduce(
      (acc, meal) => {
        acc.cost += meal.totals.cost;
        acc.calories += meal.totals.calories;
        acc.protein += meal.totals.protein;
        acc.carbs += meal.totals.carbs;
        acc.fat += meal.totals.fat;
        acc.fiber += meal.totals.fiber;
        acc.sodium += meal.totals.sodium;
        return acc;
      },
      {
        cost: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sodium: 0
      }
    );

    week.push({
      day: `Day ${i}`,
      breakfast,
      lunch,
      dinner,
      dailyTotals,
      proteinTargetMet: dailyTotals.protein >= proteinTarget
    });
  }

  return { week, foodMap };
}

function buildGroceryList(week, foodMap) {
  const counts = {};

  week.forEach((day) => {
    [day.breakfast, day.lunch, day.dinner].forEach((meal) => {
      if (!meal) return;
      meal.foods.forEach((foodId) => {
        counts[foodId] = (counts[foodId] || 0) + 1;
      });
    });
  });

  return Object.entries(counts)
    .map(([foodId, count]) => {
      const food = foodMap[foodId];
      return {
        name: food.name,
        count,
        qtyLabel: food.qtyLabel,
        estimatedCost: food.price * count
      };
    })
    .sort((a, b) => b.count - a.count);
}

function totalWeekNumbers(week) {
  return week.reduce(
    (acc, day) => {
      acc.cost += day.dailyTotals.cost;
      acc.calories += day.dailyTotals.calories;
      acc.protein += day.dailyTotals.protein;
      acc.carbs += day.dailyTotals.carbs;
      acc.fat += day.dailyTotals.fat;
      acc.fiber += day.dailyTotals.fiber;
      acc.sodium += day.dailyTotals.sodium;
      return acc;
    },
    {
      cost: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sodium: 0
    }
  );
}

function renderSummary(weekTotals, budget, days) {
  const summary = document.getElementById("summary");
  const avgDaily = weekTotals.cost / days;

  summary.innerHTML = `
    <div class="summary">
      <div class="summary-header">
        <h2 class="summary-title">Plan Summary</h2>
      </div>
      <div class="summary-body">
        <div class="summary-row">
          <span class="summary-label">Weekly Budget</span>
          <span class="summary-value">$${budget.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Estimated Cost</span>
          <span class="summary-value">$${weekTotals.cost.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Average Cost Per Day</span>
          <span class="summary-value">$${avgDaily.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Protein</span>
          <span class="summary-value">${weekTotals.protein.toFixed(1)} g</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Calories</span>
          <span class="summary-value">${weekTotals.calories.toFixed(0)} kcal</span>
        </div>
      </div>
    </div>
  `;
}

function renderNutrition(weekTotals, days) {
  const el = document.getElementById("nutritionSummary");

  el.innerHTML = `
    <div class="nutrition-box"><strong>Total Calories</strong><br>${weekTotals.calories.toFixed(0)} kcal</div>
    <div class="nutrition-box"><strong>Total Protein</strong><br>${weekTotals.protein.toFixed(1)} g</div>
    <div class="nutrition-box"><strong>Total Carbs</strong><br>${weekTotals.carbs.toFixed(1)} g</div>
    <div class="nutrition-box"><strong>Total Fat</strong><br>${weekTotals.fat.toFixed(1)} g</div>
    <div class="nutrition-box"><strong>Total Fiber</strong><br>${weekTotals.fiber.toFixed(1)} g</div>
    <div class="nutrition-box"><strong>Avg Protein / Day</strong><br>${(weekTotals.protein / days).toFixed(1)} g</div>
    <div class="nutrition-box"><strong>Avg Calories / Day</strong><br>${(weekTotals.calories / days).toFixed(0)} kcal</div>
    <div class="nutrition-box"><strong>Total Sodium</strong><br>${weekTotals.sodium.toFixed(0)} mg</div>
  `;
}

function renderGroceryList(groceryItems) {
  const list = document.getElementById("groceryList");

  list.innerHTML = groceryItems.map(item => `
    <div class="grocery-item">
      <div>
        <strong>${item.name}</strong><br>
        <span class="muted">${item.count} x ${item.qtyLabel}</span>
      </div>
      <div><strong>$${item.estimatedCost.toFixed(2)}</strong></div>
    </div>
  `).join("");
}

function renderDays(week) {
  const daysGrid = document.getElementById("daysGrid");

  daysGrid.innerHTML = week.map(day => `
    <div class="day-card">
      <h3>${day.day}</h3>

      ${renderMealBlock(day.breakfast)}
      ${renderMealBlock(day.lunch)}
      ${renderMealBlock(day.dinner)}

      <div class="meal-block">
        <h4>Daily Totals</h4>
        <div class="meta">
          Cost: <strong>$${day.dailyTotals.cost.toFixed(2)}</strong><br>
          Calories: <strong>${day.dailyTotals.calories.toFixed(0)} kcal</strong><br>
          Protein: <strong>${day.dailyTotals.protein.toFixed(1)} g</strong><br>
          Fiber: <strong>${day.dailyTotals.fiber.toFixed(1)} g</strong><br>
          Protein Target Met: <strong>${day.proteinTargetMet ? "Yes" : "No"}</strong>
        </div>
      </div>
    </div>
  `).join("");
}

function renderMealBlock(meal) {
  if (!meal) {
    return `
      <div class="meal-block">
        <h4>Meal</h4>
        <div class="meta">No meal available</div>
      </div>
    `;
  }

  return `
    <div class="meal-block">
      <h4>${meal.type}</h4>
      <div class="meal-name">${meal.name}</div>
      <div class="meta">
        Foods: ${meal.foods.map(foodId => {
          const food = FOOD_CATALOG.find(f => f.id === foodId);
          return food ? food.name : foodId;
        }).join(", ")}<br>
        Cost: <strong>$${meal.totals.cost.toFixed(2)}</strong><br>
        Calories: <strong>${meal.totals.calories.toFixed(0)} kcal</strong><br>
        Protein: <strong>${meal.totals.protein.toFixed(1)} g</strong>
      </div>
    </div>
  `;
}

function showPlannerNote(message) {
  const note = document.getElementById("plannerNotes");
  const noteText = document.getElementById("plannerNotesText");

  note.hidden = false;
  noteText.textContent = message;
}

function clearPlannerNote() {
  const note = document.getElementById("plannerNotes");
  const noteText = document.getElementById("plannerNotesText");

  note.hidden = true;
  noteText.textContent = "";
}

function createDownloadText(week, groceryItems, totals, budget) {
  let text = `SMART EATING PLANNER\n\n`;
  text += `Weekly Budget: $${budget.toFixed(2)}\n`;
  text += `Estimated Total Cost: $${totals.cost.toFixed(2)}\n`;
  text += `Total Protein: ${totals.protein.toFixed(1)} g\n`;
  text += `Total Calories: ${totals.calories.toFixed(0)} kcal\n\n`;

  text += `WEEKLY PLAN\n`;
  text += `====================\n`;

  week.forEach((day) => {
    text += `\n${day.day}\n`;
    text += `Breakfast: ${day.breakfast?.name || "N/A"}\n`;
    text += `Lunch: ${day.lunch?.name || "N/A"}\n`;
    text += `Dinner: ${day.dinner?.name || "N/A"}\n`;
    text += `Daily Cost: $${day.dailyTotals.cost.toFixed(2)}\n`;
    text += `Daily Protein: ${day.dailyTotals.protein.toFixed(1)} g\n`;
  });

  text += `\nGROCERY LIST\n`;
  text += `====================\n`;

  groceryItems.forEach((item) => {
    text += `${item.name} - ${item.count} x ${item.qtyLabel} - $${item.estimatedCost.toFixed(2)}\n`;
  });

  return text;
}

async function downloadPlan() {
  const budget = parseFloat(document.getElementById("budget").value) || 50;
  const days = parseInt(document.getElementById("days").value, 10) || 7;
  const goal = document.getElementById("goal").value;
  const diet = document.getElementById("diet").value;
  const proteinTarget = parseFloat(document.getElementById("proteinTarget").value) || 90;

  const { week, foodMap } = generateWeeklyPlan(days, goal, diet, proteinTarget);
  const groceryItems = buildGroceryList(week, foodMap);
  const totals = totalWeekNumbers(week);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  function addPageIfNeeded(extraHeight = 10) {
    if (y + extraHeight > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
  }

  function addBrandDivider() {
    addPageIfNeeded(8);

    const totalWidth = contentWidth;
    const redWidth = totalWidth * 0.35;
    const goldWidth = totalWidth * 0.30;
    const blackWidth = totalWidth * 0.35;

    const startX = margin;
    const lineY = y;

    doc.setLineWidth(1.2);

    doc.setDrawColor(229, 25, 55); // U of G red
    doc.line(startX, lineY, startX + redWidth, lineY);

    doc.setDrawColor(255, 196, 41); // U of G yellow
    doc.line(startX + redWidth, lineY, startX + redWidth + goldWidth, lineY);

    doc.setDrawColor(0, 0, 0); // black
    doc.line(startX + redWidth + goldWidth, lineY, startX + totalWidth, lineY);

    y += 8;
  }

  function addSectionTitle(title) {
    addPageIfNeeded(18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 6;

    addBrandDivider();
    y += 4;
  }

  function addKeyValueRow(label, value) {
    addPageIfNeeded(7);
    const labelX = margin;
    const valueX = margin + 48;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(label, labelX, y);

    doc.setFont("helvetica", "normal");
    const wrappedValue = doc.splitTextToSize(String(value), contentWidth - 50);
    doc.text(wrappedValue, valueX, y);

    y += Math.max(8, wrappedValue.length * 6);
  }

  function addWrappedText(text, x, maxWidth, lineHeight = 5) {
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      addPageIfNeeded(lineHeight);
      doc.text(line, x, y);
      y += lineHeight;
    });
  }

  function addMealBlock(title, meal) {
    addPageIfNeeded(22);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(`${title}:`, margin + 4, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    if (!meal) {
      doc.text("N/A", margin + 10, y);
      y += 6;
      return;
    }

    addWrappedText(`${meal.name}`, margin + 10, 165, 5);

    const foodNames = meal.foods.map((foodId) => {
      const food = FOOD_CATALOG.find((f) => f.id === foodId);
      return food ? food.name : foodId;
    }).join(", ");

    addWrappedText(`Foods: ${foodNames}`, margin + 10, 165, 5);
    addWrappedText(
      `Cost: $${meal.totals.cost.toFixed(2)}   Calories: ${meal.totals.calories.toFixed(0)} kcal   Protein: ${meal.totals.protein.toFixed(1)} g`,
      margin + 10,
      165,
      5
    );

    y += 6;
  }

  function drawTableHeader() {
    addPageIfNeeded(10);
    doc.setFillColor(17, 24, 39);
    doc.rect(margin, y - 5, contentWidth, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Item", margin + 2, y);
    doc.text("Quantity", margin + 80, y);
    doc.text("Cost", margin + 155, y);
    doc.setTextColor(0, 0, 0);

    y += 8;
  }

  async function loadImageAsDataURL(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  try {
    const logoData = await loadImageAsDataURL("image.png");
    doc.addImage(logoData, "PNG", 18, 8, 170, 42);
    y = 58;
  } catch (error) {
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Smart Eating Planner", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Weekly Meal Plan and Grocery Summary", margin, y);
  y += 12;

  addSectionTitle("Plan Summary");
  addKeyValueRow("Budget", `$${budget.toFixed(2)}`);
  addKeyValueRow("Estimated Cost", `$${totals.cost.toFixed(2)}`);
  addKeyValueRow("Goal", GOAL_LABELS[goal]);
  addKeyValueRow("Diet", DIET_LABELS[diet]);
  addKeyValueRow("Total Calories", `${totals.calories.toFixed(0)} kcal`);
  addKeyValueRow("Total Protein", `${totals.protein.toFixed(1)} g`);
  addKeyValueRow("Total Fiber", `${totals.fiber.toFixed(1)} g`);
  addKeyValueRow("Protein Target / Day", `${proteinTarget.toFixed(0)} g`);
  y += 8;
  
  addSectionTitle("Weekly Meal Plan");

  week.forEach((day) => {
    addPageIfNeeded(40);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(day.day, margin, y);
    y += 10;

    addMealBlock("Breakfast", day.breakfast);
    addMealBlock("Lunch", day.lunch);
    addMealBlock("Dinner", day.dinner);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    addWrappedText(
      `Daily total: Cost $${day.dailyTotals.cost.toFixed(2)} | Calories ${day.dailyTotals.calories.toFixed(0)} kcal | Protein ${day.dailyTotals.protein.toFixed(1)} g | Fiber ${day.dailyTotals.fiber.toFixed(1)} g`,
      margin + 4,
      170,
      5
    );

    y += 4;
  });

  addSectionTitle("Grocery List");
  drawTableHeader();

  groceryItems.forEach((item) => {
    addPageIfNeeded(8);

    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
      drawTableHeader();
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const itemName = doc.splitTextToSize(item.name, 70);
    const qtyText = doc.splitTextToSize(`${item.count} x ${item.qtyLabel}`, 65);
    const costText = `$${item.estimatedCost.toFixed(2)}`;

    const rowHeight = Math.max(itemName.length, qtyText.length) * 5;

    doc.text(itemName, margin + 2, y);
    doc.text(qtyText, margin + 80, y);
    doc.text(costText, margin + 155, y);

    y += rowHeight + 2;
  });
  y += 8;
  
  addSectionTitle("Nutrition Summary");
  addKeyValueRow("Average Calories / Day", `${(totals.calories / days).toFixed(0)} kcal`);
  addKeyValueRow("Average Protein / Day", `${(totals.protein / days).toFixed(1)} g`);
  addKeyValueRow("Average Fiber / Day", `${(totals.fiber / days).toFixed(1)} g`);
  addKeyValueRow("Total Sodium", `${totals.sodium.toFixed(0)} mg`);

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pageHeight - 8);
    doc.setTextColor(0, 0, 0);
  }

  doc.save("weekly_meal_plan.pdf");
}

function generatePlanner() {
  clearPlannerNote();

  const budget = parseFloat(document.getElementById("budget").value) || 50;
  const days = parseInt(document.getElementById("days").value, 10) || 7;
  const goal = document.getElementById("goal").value;
  const diet = document.getElementById("diet").value;
  const proteinTarget = parseFloat(document.getElementById("proteinTarget").value) || 90;

  const { week, foodMap } = generateWeeklyPlan(days, goal, diet, proteinTarget);
  const groceryItems = buildGroceryList(week, foodMap);
  const totals = totalWeekNumbers(week);

  renderSummary(totals, budget, days);
  renderNutrition(totals, days);
  renderGroceryList(groceryItems);
  renderDays(week);

  latestPlanText = createDownloadText(week, groceryItems, totals, budget);

  if (totals.cost > budget) {
    showPlannerNote(
      `This plan is over budget by $${(totals.cost - budget).toFixed(2)}. Try the "Lowest Cost" goal or a vegetarian plan.`
    );
  } else {
    showPlannerNote(
      `Good news: this plan is within budget by $${(budget - totals.cost).toFixed(2)}.`
    );
  }
}
function initBackToTop() {
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (!scrollTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  }

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();
}

document.addEventListener("DOMContentLoaded", () => {
  initBackToTop();
});
async function loadFoodData() {
  try {
    const response = await fetch(JSON_FILE);
    if (!response.ok) throw new Error("Could not load JSON data.");
    const data = await response.json();
    foundationFoods = data.FoundationFoods || [];
    generatePlanner();
  } catch (error) {
    console.error(error);
    foundationFoods = [];
    generatePlanner();
    showPlannerNote("JSON could not be loaded, so fallback nutrition values were used.");
  }
}

document.getElementById("budget").addEventListener("wheel", function (e) {
  e.target.blur();
});

document.getElementById("generateBtn").addEventListener("click", generatePlanner);
document.getElementById("downloadBtn").addEventListener("click", downloadPlan);

loadFoodData();