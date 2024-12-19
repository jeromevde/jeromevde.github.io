async function fetchCSV(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Could not fetch ${url}, received ${response.status}`);
    }
    const text = await response.text();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0); // Remove empty lines
    const cleanQuotes = str => str.replace(/^"|"$/g, '').trim(); // Remove surrounding quotes
    const headers = lines[0].split(',').map(header => cleanQuotes(header)); // Extract headers
    return lines.slice(1).map(line => {
        const columns = line.split(',').map(col => cleanQuotes(col));
        return headers.reduce((obj, header, index) => {
            obj[header] = columns[index] || undefined; // Map columns to headers
            return obj;
        }, {});
    });
}

async function loadData() {
    const food_nutrient = await fetchCSV('https://jeromevde.github.io/jekyll-blog/2024-08-12-meal-plan/FoodData_Central_October_2024/food_nutrient.csv');
    const food = await fetchCSV('https://jeromevde.github.io/jekyll-blog/2024-08-12-meal-plan/FoodData_Central_October_2024/food.csv');
    const nutrient = await fetchCSV('https://jeromevde.github.io/jekyll-blog/2024-08-12-meal-plan/FoodData_Central_October_2024/nutrient.csv');
    return { food_nutrient, food, nutrient };
}

function findFoodByName(foodsData, foodName) {
    const normalizedFoodName = foodName.toLowerCase();
    return foodsData.find(food => food.description && food.description.toLowerCase() === normalizedFoodName);
}

function getNutrientDetails(foodNutrientData, nutrientsData, fdcId) {
    const nutrientInfo = foodNutrientData.filter(nutrient => nutrient.fdc_id == fdcId);
    return nutrientInfo.map(nutrient => {
        const nutrientDetail = nutrientsData.find(n => n.id == nutrient.nutrient_id); // Compare as strings
        return {
            name: nutrientDetail ? nutrientDetail.name : 'Unknown Nutrient',
            amount: nutrient.amount || 'N/A',
            unit: nutrientDetail ? nutrientDetail.unit_name : 'Unknown Unit',
            data_points: nutrient.data_points || 'N/A',
            min: nutrient.min || 'N/A',
        };
    });
}



const {food_nutrient, food, nutrient} = await loadData();
const foodName = 'Pear, Anjou, green, with skin, raw';
const foodItem = findFoodByName(food, foodName);
const result = getNutrientDetails(food_nutrient, nutrient, foodItem.fdc_id);
console.log(result);
