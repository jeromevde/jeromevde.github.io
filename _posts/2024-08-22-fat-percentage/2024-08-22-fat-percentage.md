<script src="{{ '/assets/js/skinfold-calculator.js' | relative_url }}"></script>


# 7-Site Skinfold Pollock Calculator

<div>
  <label for="chest">Chest (mm):</label>
  <input type="number" id="chest">
</div>
<div>
  <label for="abdomen">Abdomen (mm):</label>
  <input type="number" id="abdomen">
</div>
<div>
  <label for="thigh">Thigh (mm):</label>
  <input type="number" id="thigh">
</div>
<div>
  <label for="tricep">Tricep (mm):</label>
  <input type="number" id="tricep">
</div>
<div>
  <label for="subscapular">Subscapular (mm):</label>
  <input type="number" id="subscapular">
</div>
<div>
  <label for="suprailiac">Suprailiac (mm):</label>
  <input type="number" id="suprailiac">
</div>
<div>
  <label for="midaxillary">Midaxillary (mm):</label>
  <input type="number" id="midaxillary">
</div>
<div>
  <button onclick="calculateBodyFat()">Calculate Body Fat Percentage</button>
</div>
<div>
  <label for="bodyFatPercentage">Body Fat Percentage (%):</label>
  <input type="text" id="bodyFatPercentage" readonly>
</div>