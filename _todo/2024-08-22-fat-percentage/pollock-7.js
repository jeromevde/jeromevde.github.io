function calculateBodyFat() {
    var chest = parseFloat(document.getElementById("chest").value);
    var abdomen = parseFloat(document.getElementById("abdomen").value);
    var thigh = parseFloat(document.getElementById("thigh").value);
    var tricep = parseFloat(document.getElementById("tricep").value);
    var subscapular = parseFloat(document.getElementById("subscapular").value);
    var suprailiac = parseFloat(document.getElementById("suprailiac").value);
    var midaxillary = parseFloat(document.getElementById("midaxillary").value);
  
    var sumOfSkinfolds = chest + abdomen + thigh + tricep + subscapular + suprailiac + midaxillary;
    var bodyDensity = 1.097 - (0.00046971 * sumOfSkinfolds) + (0.00000056 * Math.pow(sumOfSkinfolds, 2)) - (0.00012828 * 30); // Assuming age is 30
    var bodyFatPercentage = ((4.95 / bodyDensity) - 4.50) * 100;
  
    document.getElementById("bodyFatPercentage").value = bodyFatPercentage.toFixed(2);
  }
  