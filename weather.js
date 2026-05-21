const weatherCodes = {
    0: { desc: "Clear sky", icon: "☀️" },
    1: { desc: "Mainly clear", icon: "🌤️" },
    2: { desc: "Partly cloudy", icon: "⛅" },
    3: { desc: "Overcast", icon: "☁️" },
    45: { desc: "Fog", icon: "🌫️" },
    48: { desc: "Depositing rime fog", icon: "🌫️" },
    51: { desc: "Light Drizzle", icon: "🌧️" },
    53: { desc: "Moderate Drizzle", icon: "🌧️" },
    55: { desc: "Dense Drizzle", icon: "🌧️" },
    61: { desc: "Slight Rain", icon: "☔" },
    63: { desc: "Moderate Rain", icon: "☔" },
    65: { desc: "Heavy Rain", icon: "⛈️" },
    71: { desc: "Slight Snow", icon: "❄️" },
    73: { desc: "Moderate Snow", icon: "❄️" },
    75: { desc: "Heavy Snow", icon: "❄️" },
    95: { desc: "Thunderstorm", icon: "🌩️" },
    96: { desc: "Thunderstorm + Hail", icon: "🌩️" },
    99: { desc: "Heavy Thunderstorm", icon: "⛈️" }
};

function getWeatherInfo(code) {
    return weatherCodes[code] || { desc: "Unknown", icon: "❓" };
}

async function searchCity(query) {
    if(!query) return;
    const resultsBox = document.getElementById('search-results');
    resultsBox.innerHTML = '<div style="padding: 1rem;">Searching...</div>';
    resultsBox.style.display = 'block';

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        const data = await res.json();
        
        resultsBox.innerHTML = '';
        
        if(!data.results || data.results.length === 0) {
            resultsBox.innerHTML = '<div style="padding: 1rem;">No cities found. Try another search.</div>';
            return;
        }

        data.results.forEach(city => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            
            // Build nice location string (e.g. Paris, Ile-de-France, France)
            let locParts = [city.name];
            if (city.admin1 && city.admin1 !== city.name) locParts.push(city.admin1);
            locParts.push(city.country);
            const fullName = locParts.join(', ');

            div.innerText = fullName;
            div.onclick = () => {
                document.getElementById('current-location-display').innerText = fullName;
                resultsBox.style.display = 'none';
                document.getElementById('city-search').value = '';
                fetchWeather(city.latitude, city.longitude, city.timezone || 'auto');
            };
            resultsBox.appendChild(div);
        });
    } catch(e) {
        resultsBox.innerHTML = '<div style="padding: 1rem; color: var(--danger);">Error connecting to geocoding API.</div>';
    }
}

async function fetchWeather(lat, lon, timezoneStr) {
    const loading = document.getElementById('loading');
    const content = document.getElementById('weather-content');
    
    loading.style.display = 'block';
    content.style.display = 'none';

    try {
        // Use auto timezone if open-meteo supports it, or pass the specific one
        const tzParam = timezoneStr === 'auto' ? 'auto' : encodeURIComponent(timezoneStr);
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=${tzParam}`);
        const data = await response.json();

        // 1. Current Weather
        const currentInfo = getWeatherInfo(data.current_weather.weathercode);
        document.getElementById('current-temp').innerText = `${Math.round(data.current_weather.temperature)}°C`;
        document.getElementById('current-icon').innerText = currentInfo.icon;
        document.getElementById('current-desc').innerText = currentInfo.desc;

        // 2. Hourly (Next 24 hours)
        const hourlyContainer = document.getElementById('hourly-container');
        hourlyContainer.innerHTML = '';
        
        // Find the index that matches current time or closest future
        const now = new Date();
        let currentHourIndex = data.hourly.time.findIndex(t => new Date(t) > now);
        if (currentHourIndex === -1) currentHourIndex = 0; // fallback
        
        for(let i = currentHourIndex; i < currentHourIndex + 24; i++) {
            if(i >= data.hourly.time.length) break;
            
            const timeStr = data.hourly.time[i];
            // Format time string to hours
            const hour = timeStr.split('T')[1].substring(0,5);
            const temp = data.hourly.temperature_2m[i];
            const info = getWeatherInfo(data.hourly.weathercode[i]);
            
            hourlyContainer.innerHTML += `
                <div class="hourly-item">
                    <div class="hourly-time">${hour}</div>
                    <div style="font-size: 1.5rem; margin: 0.5rem 0;">${info.icon}</div>
                    <div class="hourly-temp">${Math.round(temp)}°</div>
                </div>
            `;
        }

        // 3. Daily
        const dailyContainer = document.getElementById('daily-container');
        dailyContainer.innerHTML = '';
        
        for(let i = 0; i < data.daily.time.length; i++) {
            const dateStr = data.daily.time[i];
            // Get day of week safely
            const dateObj = new Date(dateStr);
            const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            
            const maxT = Math.round(data.daily.temperature_2m_max[i]);
            const minT = Math.round(data.daily.temperature_2m_min[i]);
            const info = getWeatherInfo(data.daily.weathercode[i]);
            
            dailyContainer.innerHTML += `
                <div class="daily-item">
                    <div class="daily-day">${dayName}</div>
                    <div class="daily-icon">${info.icon}</div>
                    <div class="daily-temps">
                        <span style="font-weight: 800; color: var(--accent-1);">${maxT}°</span> / 
                        <span style="color: var(--text-secondary);">${minT}°</span>
                    </div>
                </div>
            `;
        }

        loading.style.display = 'none';
        content.style.display = 'block';

    } catch (error) {
        loading.innerText = "Error fetching weather data. Please try again.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('city-search');
    const searchBtn = document.getElementById('search-btn');
    
    const triggerSearch = () => searchCity(searchInput.value.trim());

    searchBtn.addEventListener('click', triggerSearch);
    searchInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') triggerSearch();
    });

    // Hide results if clicking outside
    document.addEventListener('click', (e) => {
        if(!e.target.closest('#search-results') && e.target !== searchInput) {
            document.getElementById('search-results').style.display = 'none';
        }
    });

    // Initial default location (London as fallback)
    document.getElementById('current-location-display').innerText = "London, England, United Kingdom";
    fetchWeather(51.5074, -0.1278, 'auto');
});
