// Initial default clocks
let userClocks = [
    { zone: "America/New_York" },
    { zone: "Europe/London" },
    { zone: "Asia/Tokyo" },
    { zone: "Asia/Kolkata" }
];

let clockInterval = null;

function formatZoneName(zoneStr) {
    const parts = zoneStr.split('/');
    let city = parts[parts.length - 1].replace(/_/g, ' ');
    return city;
}

function populateTimezones() {
    const select = document.getElementById('tz-select');
    try {
        const timezones = Intl.supportedValuesOf('timeZone');
        timezones.forEach(tz => {
            select.add(new Option(tz.replace(/_/g, ' '), tz));
        });
    } catch (e) {
        // Fallback if browser doesn't support Intl.supportedValuesOf
        select.add(new Option("Browser does not support full timezone list", "UTC"));
    }
}

function renderClockCards() {
    const container = document.getElementById('clocks-container');
    container.innerHTML = '';
    
    userClocks.forEach((clock, index) => {
        const card = document.createElement('div');
        card.className = 'glass-panel clock-card';
        card.innerHTML = `
            <div class="clock-city">${formatZoneName(clock.zone)}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.8rem;">${clock.zone.split('/')[0]}</div>
            <div class="clock-time" id="clock-${index}">--:--:--</div>
            <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;" id="date-${index}">---</div>
            <button class="remove-btn" onclick="removeClock(${index})">Remove</button>
        `;
        container.appendChild(card);
    });
}

function updateClocks() {
    const now = new Date();
    
    userClocks.forEach((clock, index) => {
        const timeEl = document.getElementById(`clock-${index}`);
        const dateEl = document.getElementById(`date-${index}`);
        
        if(timeEl && dateEl) {
            try {
                timeEl.innerText = now.toLocaleTimeString('en-US', {
                    timeZone: clock.zone,
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit'
                });
                
                dateEl.innerText = now.toLocaleDateString('en-US', {
                    timeZone: clock.zone,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
            } catch(e) {
                timeEl.innerText = "Error";
            }
        }
    });
}

// Global function to remove clock (assigned to inline onclick)
window.removeClock = function(index) {
    userClocks.splice(index, 1);
    renderClockCards();
    updateClocks();
};

document.addEventListener('DOMContentLoaded', () => {
    populateTimezones();
    renderClockCards();
    updateClocks();
    
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateClocks, 1000);

    // Add Clock button
    document.getElementById('add-btn').addEventListener('click', () => {
        const select = document.getElementById('tz-select');
        const selectedZone = select.value;
        
        // Check if already exists
        if (userClocks.find(c => c.zone === selectedZone)) {
            alert("This timezone is already on your dashboard!");
            return;
        }

        userClocks.push({ zone: selectedZone });
        renderClockCards();
        updateClocks();
    });
});
