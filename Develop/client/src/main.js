import './styles/jass.css';

// * Select necessary DOM elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const todayContainer = document.querySelector('#today');
const forecastContainer = document.querySelector('#forecast');
const searchHistoryContainer = document.getElementById('history');
const clearHistoryBtn = document.createElement("button");
const heading = document.getElementById('search-title');
const weatherIcon = document.getElementById('weather-img');
const tempEl = document.getElementById('temp');
const windEl = document.getElementById('wind');
const humidityEl = document.getElementById('humidity');
const loadingIndicator = document.createElement("p"); // * New loading indicator

// * API Key for OpenWeatherMap
const API_KEY = "ba7def358b93b4fdcf26b57987ace3e0";

// * Fetch weather data (current & forecast)
const fetchWeather = async (cityName) => {
    try {
        // * Display loading indicator
        showLoading(true);

        // * Fetch current weather data
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=imperial`
        );

        if (!weatherResponse.ok) throw new Error(`City not found. Please try again.`);

        const weatherData = await weatherResponse.json();
        renderCurrentWeather(weatherData);
        saveSearchHistory(cityName);

        // * Fetch 5-day forecast data
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=imperial`
        );

        if (!forecastResponse.ok) throw new Error(`Error fetching forecast.`);

        const forecastData = await forecastResponse.json();
        renderForecast(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        showErrorMessage(error.message);
    } finally {
        // * Hide loading indicator
        showLoading(false);
    }
};

// * Render the current weather
const renderCurrentWeather = (weatherData) => {
    const { name: city, main, weather, wind } = weatherData;
    
    heading.textContent = `${city}`;
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/w/${weather[0].icon}.png`);
    weatherIcon.setAttribute("alt", weather[0].description);
    tempEl.textContent = `Temp: ${main.temp} °F`;
    windEl.textContent = `Wind: ${wind.speed} MPH`;
    humidityEl.textContent = `Humidity: ${main.humidity}%`;

    todayContainer.innerHTML = "";
    todayContainer.append(heading, weatherIcon, tempEl, windEl, humidityEl);
};

// * Render the 5-day forecast
const renderForecast = (forecastData) => {
    forecastContainer.innerHTML = "<h4>5-Day Forecast:</h4>";

    const dailyForecasts = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.forEach((forecast) => {
        const { dt_txt, main, weather, wind } = forecast;

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast-card");

        forecastCard.innerHTML = `
            <h5>${new Date(dt_txt).toLocaleDateString()}</h5>
            <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="${weather[0].description}">
            <p>Temp: ${main.temp}°F</p>
            <p>Wind: ${wind.speed} MPH</p>
            <p>Humidity: ${main.humidity}%</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
};

// * Save search history to localStorage
const saveSearchHistory = (cityName) => {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(history));
    }
    renderSearchHistory();
};

// * Render search history with "Clear History" button
const renderSearchHistory = () => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryContainer.innerHTML = "";

    if (history.length > 0) {
        clearHistoryBtn.textContent = "Clear History";
        clearHistoryBtn.classList.add("clear-btn");
        clearHistoryBtn.addEventListener("click", clearSearchHistory);
        searchHistoryContainer.appendChild(clearHistoryBtn);
    }

    history.forEach((city) => {
        const historyBtn = document.createElement("button");
        historyBtn.textContent = city;
        historyBtn.classList.add("history-btn");
        historyBtn.addEventListener("click", () => fetchWeather(city));

        searchHistoryContainer.appendChild(historyBtn);
    });
};

// * Clear search history
const clearSearchHistory = () => {
    localStorage.removeItem("searchHistory");
    renderSearchHistory();
};

// * Display loading indicator
const showLoading = (isLoading) => {
    if (isLoading) {
        loadingIndicator.textContent = "Fetching weather data...";
        loadingIndicator.classList.add("loading");
        todayContainer.innerHTML = "";
        forecastContainer.innerHTML = "";
        todayContainer.appendChild(loadingIndicator);
    } else {
        loadingIndicator.remove();
    }
};

// * Show error message
const showErrorMessage = (message) => {
    todayContainer.innerHTML = `<p class="error">${message}</p>`;
};

// * Handle form submission
const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    const city = searchInput.value.trim();

    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
        alert("Please enter a valid city name.");
        return;
    }

    fetchWeather(city);
    searchInput.value = "";
};

// * Initial setup
searchForm?.addEventListener("submit", handleSearchFormSubmit);
renderSearchHistory();
