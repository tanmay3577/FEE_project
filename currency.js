const currencyData = [
    { code: "USD", name: "United States", symbol: "$", zone: "America/New_York", rate: 1 },
    { code: "INR", name: "India", symbol: "₹", zone: "Asia/Kolkata", rate: 83.12 },
    { code: "EUR", name: "Eurozone", symbol: "€", zone: "Europe/Berlin", rate: 0.92 },
    { code: "GBP", name: "United Kingdom", symbol: "£", zone: "Europe/London", rate: 0.79 },
    { code: "JPY", name: "Japan", symbol: "¥", zone: "Asia/Tokyo", rate: 151.24 },
    { code: "AUD", name: "Australia", symbol: "A$", zone: "Australia/Sydney", rate: 1.53 },
    { code: "CAD", name: "Canada", symbol: "C$", zone: "America/Toronto", rate: 1.36 },
    { code: "CNY", name: "China", symbol: "¥", zone: "Asia/Shanghai", rate: 7.23 },
    { code: "AED", name: "UAE", symbol: "د.إ", zone: "Asia/Dubai", rate: 3.67 },
    { code: "SAR", name: "Saudi Arabia", symbol: "﷼", zone: "Asia/Riyadh", rate: 3.75 }
];

// Helper to get time
function getLocalTime(zone) {
    try {
        return new Date().toLocaleTimeString('en-US', { 
            timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
        });
    } catch(e) {
        return "--:--:--";
    }
}

// Calculate Conversion
function calculate() {
    const amount = document.getElementById('amount').value;
    const fromCode = document.getElementById('fromCurrency').value;
    const toCode = document.getElementById('toCurrency').value;

    if(!amount || amount <= 0) {
        document.getElementById('result-text').innerText = "Enter valid amount";
        return;
    }

    const fromObj = currencyData.find(c => c.code === fromCode);
    const toObj = currencyData.find(c => c.code === toCode);
    
    if(!fromObj || !toObj) return;

    // Convert from source to USD, then from USD to target
    const amountInUSD = amount / fromObj.rate;
    const result = amountInUSD * toObj.rate;
    
    document.getElementById('result-text').innerText = `${fromObj.symbol}${amount} = ${toObj.symbol}${result.toFixed(2)}`;
}

// Update local times in table periodically
function startLocalClocks() {
    setInterval(() => {
        document.querySelectorAll('.local-time').forEach(cell => {
            cell.innerText = getLocalTime(cell.getAttribute('data-zone'));
        });
    }, 1000);
}

// Initialize Website
function initCurrency() {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const tableBody = document.getElementById('rates-body');

    currencyData.forEach(item => {
        // Fill Dropdowns
        let opt1 = new Option(`${item.symbol} ${item.code} - ${item.name}`, item.code);
        let opt2 = new Option(`${item.symbol} ${item.code} - ${item.name}`, item.code);
        fromSelect.add(opt1);
        toSelect.add(opt2);
        
        // Fill Table
        tableBody.innerHTML += `
            <tr style="border-bottom: 1px solid var(--card-border);">
                <td style="padding: 1rem;">${item.name}</td>
                <td style="padding: 1rem; font-weight: 600;">${item.symbol} ${item.code}</td>
                <td style="padding: 1rem;">${item.rate}</td>
                <td style="padding: 1rem; color: var(--accent-3); font-weight: 600;" class="local-time" data-zone="${item.zone}">${getLocalTime(item.zone)}</td>
            </tr>`;
    });

    fromSelect.value = "INR";
    toSelect.value = "USD"; // Set default

    // Event Listeners for Live Calculation
    [fromSelect, toSelect, document.getElementById('amount')].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calculate(); // Run once at start
    startLocalClocks();
}

// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', initCurrency);
