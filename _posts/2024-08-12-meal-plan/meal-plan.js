document.addEventListener('DOMContentLoaded', function() {
    const meals = document.querySelectorAll('.meal');
    const mealInfo = document.getElementById('meal-info');
  
    meals.forEach(meal => {
      meal.addEventListener('mouseover', function() {
        mealInfo.textContent = this.getAttribute('data-info');
        mealInfo.style.display = 'block';
      });
  
      meal.addEventListener('mouseout', function() {
        mealInfo.style.display = 'none';
      });
    });
  });