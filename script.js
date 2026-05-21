const currencyData = [
    { code: "USD", name: "United States", symbol: "$", zone: "America/New_York", rate: 1 },
    { code: "INR", name: "India", symbol: "₹", zone: "Asia/Kolkata", rate: 93.82 },
    { code: "EUR", name: "Eurozone", symbol: "€", zone: "Europe/Berlin", rate: 0.86 },
    { code: "GBP", name: "United Kingdom", symbol: "£", zone: "Europe/London", rate: 0.75 },
    { code: "JPY", name: "Japan", symbol: "¥", zone: "Asia/Tokyo", rate: 159.54 },
    { code: "AUD", name: "Australia", symbol: "A$", zone: "Australia/Sydney", rate: 1.41 },
    { code: "CAD", name: "Canada", symbol: "C$", zone: "America/Toronto", rate: 1.36 },
    { code: "CNY", name: "China", symbol: "¥", zone: "Asia/Shanghai", rate: 6.89 },
    { code: "AED", name: "UAE", symbol: "د.إ", zone: "Asia/Dubai", rate: 3.67 },
    { code: "SAR", name: "Saudi Arabia", symbol: "﷼", zone: "Asia/Riyadh", rate: 3.75 }
];

// Helper to get time
function getLocalTime(zone) {
    return new Date().toLocaleTimeString('en-GB', { 
        timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit' 
    });
}

// Update clock every second
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    document.querySelectorAll('.local-time').forEach(cell => {
        cell.innerText = getLocalTime(cell.getAttribute('data-zone'));
    });
}, 1000);

// Toggle Theme
document.getElementById('theme-toggle').addEventListener('click', () => {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        document.getElementById('theme-toggle').innerText = "🌙 Dark Mode";
    } else {
        body.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').innerText = "☀️ Light Mode";
    }
});

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
    
    const result = (toObj.rate / fromObj.rate) * amount;
    document.getElementById('result-text').innerText = `${fromObj.symbol}${amount} = ${toObj.symbol}${result.toFixed(2)}`;
}

// Initialize Website
function init() {
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
            <tr>
                <td>${item.name}</td>
                <td>${item.symbol} ${item.code}</td>
                <td>${item.rate}</td>
                <td class="local-time" data-zone="${item.zone}">${getLocalTime(item.zone)}</td>
            </tr>`;
    });

    toSelect.value = "INR"; // Set default

    // Event Listeners for Live Calculation
    [fromSelect, toSelect, document.getElementById('amount')].forEach(el => {
        el.addEventListener('input', calculate);
    });

    calculate(); // Run once at start
}

window.onload = init;