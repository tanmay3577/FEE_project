document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('sip-amount');
    const rateInput = document.getElementById('sip-rate');
    const yearsInput = document.getElementById('sip-years');
    const calcBtn = document.getElementById('calc-sip-btn');
    const resultsDiv = document.getElementById('sip-results');
    
    const resInvestment = document.getElementById('res-investment');
    const resReturns = document.getElementById('res-returns');
    const resTotal = document.getElementById('res-total');
    
    let chartInstance = null;
    const ctx = document.getElementById('sipChart').getContext('2d');

    calcBtn.addEventListener('click', () => {
        const P = parseFloat(amountInput.value); // Monthly investment
        const r = parseFloat(rateInput.value) / 12 / 100; // Monthly interest rate
        const n = parseFloat(yearsInput.value) * 12; // Total number of months

        if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || r < 0 || n <= 0) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        // SIP Formula: M = P * [((1 + r)^n - 1) / r] * (1 + r)
        // Note: The standard SIP formula in India generally assumes investment at the beginning of the month.
        const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const totalInvestment = P * n;
        const estReturns = futureValue - totalInvestment;

        // Update UI
        resInvestment.innerText = `₹${totalInvestment.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        resReturns.innerText = `₹${estReturns.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;
        resTotal.innerText = `₹${futureValue.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`;

        resultsDiv.style.display = 'block';

        // Update Chart
        if (chartInstance) {
            chartInstance.destroy();
        }

        const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim();

        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Invested Amount', 'Est. Returns'],
                datasets: [{
                    data: [totalInvestment, estReturns],
                    backgroundColor: ['#3b82f6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor
                        }
                    }
                }
            }
        });
        
        // Button effect
        const originalText = calcBtn.innerText;
        calcBtn.innerText = 'Calculated!';
        setTimeout(() => {
            calcBtn.innerText = originalText;
        }, 1000);
    });
});
