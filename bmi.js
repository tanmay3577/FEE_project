document.getElementById('calc-btn').addEventListener('click', calculateBMI);

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    
    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
        alert("Please enter valid weight and height.");
        return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    
    displayResult(bmi);
}

function displayResult(bmi) {
    const resultBox = document.getElementById('result-box');
    const valueEl = document.getElementById('bmi-value');
    const categoryEl = document.getElementById('bmi-category');
    const markerEl = document.getElementById('bmi-marker');
    
    resultBox.style.display = 'block';
    valueEl.innerText = bmi.toFixed(1);
    
    let category = "";
    let color = "";
    let markerPercent = 0;

    if (bmi < 18.5) {
        category = "Underweight";
        color = "#3b82f6"; // Blue
        markerPercent = (bmi / 18.5) * 25; // Scale 0-25%
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal Weight";
        color = "#10b981"; // Green
        markerPercent = 25 + ((bmi - 18.5) / (25 - 18.5)) * 35; // Scale 25-60%
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        color = "#f59e0b"; // Orange
        markerPercent = 60 + ((bmi - 25) / (30 - 25)) * 15; // Scale 60-75%
    } else {
        category = "Obese";
        color = "#ef4444"; // Red
        let capBmi = Math.min(bmi, 40); // Cap visual at 40
        markerPercent = 75 + ((capBmi - 30) / (40 - 30)) * 25; // Scale 75-100%
    }

    categoryEl.innerText = category;
    categoryEl.style.color = color;
    valueEl.style.color = color;
    
    // Animate marker
    setTimeout(() => {
        markerEl.style.left = `${Math.min(markerPercent, 100)}%`;
    }, 100);
}
