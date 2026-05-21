// Simulated Market Data
const assets = {
    gold: { name: "Gold (10g, 24K)", symbol: "₹", basePrice: 72450, currentPrice: 72450, volatility: 0.0005, elId: "gold" },
    silver: { name: "Silver (1kg)", symbol: "₹", basePrice: 91200, currentPrice: 91200, volatility: 0.0008, elId: "silver" }
};

const stocks = [
    { sym: "NIFTY", basePrice: 22450, currentPrice: 22450, vol: 0.001 },
    { sym: "SENSEX", basePrice: 73800, currentPrice: 73800, vol: 0.001 },
    { sym: "RELIANCE", basePrice: 2850, currentPrice: 2850, vol: 0.002 },
    { sym: "TCS", basePrice: 3950, currentPrice: 3950, vol: 0.0015 },
    { sym: "HDFC", basePrice: 1520, currentPrice: 1520, vol: 0.002 },
    { sym: "AAPL", basePrice: 175, currentPrice: 175, vol: 0.003, isUSD: true },
    { sym: "GOOGL", basePrice: 155, currentPrice: 155, vol: 0.003, isUSD: true }
];

function formatMoney(amount, isUSD = false) {
    if (isUSD) return "$" + amount.toFixed(2);
    return "₹" + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function initMarkets() {
    // 1. Setup Commodities
    const commContainer = document.getElementById('commodities-container');
    Object.values(assets).forEach(asset => {
        commContainer.innerHTML += `
            <div class="glass-panel asset-card" id="card-${asset.elId}">
                <div class="asset-title">${asset.name}</div>
                <div class="asset-price" id="price-${asset.elId}">${formatMoney(asset.currentPrice)}</div>
                <div class="asset-change" id="change-${asset.elId}">0.00%</div>
            </div>
        `;
    });

    // 2. Setup Stock Ticker (Duplicate items to make it infinite loop smoothly)
    const tickerInner = document.getElementById('ticker-inner');
    let tickerHtml = '';
    
    // We generate HTML for stocks twice to ensure seamless scrolling
    const generateTickerItems = () => {
        let html = '';
        stocks.forEach((s, idx) => {
            html += `<div class="ticker-item">
                        ${s.sym} 
                        <span id="stock-p-${idx}">--</span> 
                        <span id="stock-c-${idx}" style="font-size:0.8rem">--</span>
                     </div>`;
        });
        return html;
    };
    
    tickerInner.innerHTML = generateTickerItems() + generateTickerItems();

    // 3. Start Live Updates
    setInterval(updateMarkets, 2000);
    // Initial display
    updateStockDisplay();
}

function updateMarkets() {
    // Update Commodities
    Object.values(assets).forEach(asset => {
        const changePercent = (Math.random() - 0.5) * asset.volatility;
        const newPrice = asset.currentPrice * (1 + changePercent);
        
        const isUp = newPrice >= asset.currentPrice;
        const diffPercent = ((newPrice - asset.basePrice) / asset.basePrice) * 100;
        
        asset.currentPrice = newPrice;
        
        const priceEl = document.getElementById(`price-${asset.elId}`);
        const changeEl = document.getElementById(`change-${asset.elId}`);
        const cardEl = document.getElementById(`card-${asset.elId}`);
        
        priceEl.innerText = formatMoney(newPrice);
        changeEl.innerText = `${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(2)}%`;
        
        changeEl.className = `asset-change ${diffPercent >= 0 ? 'up' : 'down'}`;
        priceEl.style.color = isUp ? 'var(--success)' : 'var(--danger)';
        
        // Trigger Flash Animation
        cardEl.classList.remove('flash-up', 'flash-down');
        void cardEl.offsetWidth; // Trigger reflow
        cardEl.classList.add(isUp ? 'flash-up' : 'flash-down');
        
        // Reset color after a moment
        setTimeout(() => { priceEl.style.color = ''; }, 500);
    });

    // Update Stocks
    stocks.forEach(s => {
        const changePercent = (Math.random() - 0.5) * s.vol;
        s.currentPrice = s.currentPrice * (1 + changePercent);
    });
    
    updateStockDisplay();
}

function updateStockDisplay() {
    stocks.forEach((s, idx) => {
        const diffPercent = ((s.currentPrice - s.basePrice) / s.basePrice) * 100;
        const isUp = diffPercent >= 0;
        
        // Update both instances in the duplicated ticker
        const displaysP = document.querySelectorAll(`[id^="stock-p-${idx}"]`);
        const displaysC = document.querySelectorAll(`[id^="stock-c-${idx}"]`);
        
        displaysP.forEach((el, i) => {
            // Need to calculate real index based on NodeList if using querySelectorAll properly, 
            // but since we hardcoded duplicate ids in innerHTML, let's just re-render ticker entirely
            // Actually, HTML IDs must be unique, so let's use classes instead of IDs for the ticker.
        });
    });
    
    // Better way: Re-render the inner HTML with updated values
    const tickerInner = document.getElementById('ticker-inner');
    const generateTickerItemsWithData = () => {
        let html = '';
        stocks.forEach(s => {
            const diffPercent = ((s.currentPrice - s.basePrice) / s.basePrice) * 100;
            const isUp = diffPercent >= 0;
            const colorClass = isUp ? 'up' : 'down';
            const arrow = isUp ? '▲' : '▼';
            
            html += `<div class="ticker-item ${colorClass}">
                        ${s.sym} ${formatMoney(s.currentPrice, s.isUSD)} 
                        <span style="font-size:0.8rem">${arrow} ${Math.abs(diffPercent).toFixed(2)}%</span>
                     </div>`;
        });
        return html;
    };
    
    tickerInner.innerHTML = generateTickerItemsWithData() + generateTickerItemsWithData();
}

document.addEventListener('DOMContentLoaded', initMarkets);
