import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading = document.getElementById('search-title') as HTMLHeadingElement;
const weatherIcon = document.getElementById('weather-img') as HTMLImageElement;
const tempEl = document.getElementById('temp') as HTMLParagraphElement;
const windEl = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl = document.getElementById('humidity') as HTMLParagraphElement;

/*

API Calls

*/

const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('/api/weather/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName }),
    });

    if (!response.ok) throw new Error(`Failed to fetch weather: ${response.status}`);

    const weatherData = await response.json();
    console.log('API Response:', weatherData);

    renderCurrentWeather(weatherData[0]);
    renderForecast(weatherData.slice(1));
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
};

const fetchSearchHistory = async () => {
  try {
    const response = await fetch('/api/weather/history', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Failed to fetch history: ${response.status}`);

    return response.json(); // Ensuring the response is parsed
  } catch (error) {
    console.error('Error fetching history:', error);
    return []; // Return an empty array to prevent crashes
  }
};

const deleteCityFromHistory = async (id: string) => {
  try {
    const response = await fetch(`/api/weather/history/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Failed to delete city: ${response.status}`);

    getAndRenderHistory(); // Refresh the history after deletion
  } catch (error) {
    console.error('Error deleting city:', error);
  }
};

/*

Render Functions

*/

const renderCurrentWeather = (currentWeather: any): void => {
  if (!currentWeather) return;

  const { city, date, icon, iconDescription, tempF, windSpeed, humidity } = currentWeather;

  heading.textContent = `${city} (${date})`;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.alt = iconDescription;
  weatherIcon.className = 'weather-img';

  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  if (todayContainer) {
    todayContainer.innerHTML = ''; // Clear old content
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

const renderForecast = (forecast: any[]): void => {
  if (!forecast.length) return;

  forecastContainer.innerHTML = '<h4 class="col-12">5-Day Forecast:</h4>';

  forecast.forEach(renderForecastCard);
};

const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  cardTitle.textContent = date;
  weatherIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
  weatherIcon.alt = iconDescription;
  tempEl.textContent = `Temp: ${tempF}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  forecastContainer.append(col);
};

const renderSearchHistory = async () => {
  const historyList = await fetchSearchHistory();

  searchHistoryContainer.innerHTML = historyList.length
    ? ''
    : '<p class="text-center">No Previous Search History</p>';

  historyList.reverse().forEach((city: any) => {
    searchHistoryContainer.append(buildHistoryListItem(city));
  });
};

/*

Helper Functions

*/

const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.className = 'col-auto';
  card.className = 'forecast-card card text-white bg-primary h-100';
  cardBody.className = 'card-body p-2';
  cardTitle.className = 'card-title';
  tempEl.className = 'card-text';
  windEl.className = 'card-text';
  humidityEl.className = 'card-text';

  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
  card.append(cardBody);
  col.append(card);

  return { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl };
};

const createHistoryButton = (city: string) => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-controls', 'today forecast');
  btn.className = 'history-btn btn btn-secondary col-10';
  btn.textContent = city;
  return btn;
};

const createDeleteButton = (city: any) => {
  const delBtnEl = document.createElement('button');
  delBtnEl.type = 'button';
  delBtnEl.className = 'fas fa-trash-alt delete-city btn btn-danger col-2';
  delBtnEl.dataset.city = JSON.stringify(city);
  delBtnEl.addEventListener('click', handleDeleteHistoryClick);
  return delBtnEl;
};

const createHistoryDiv = () => {
  const div = document.createElement('div');
  div.className = 'display-flex gap-2 col-12 m-1';
  return div;
};

const buildHistoryListItem = (city: any) => {
  const historyDiv = createHistoryDiv();
  historyDiv.append(createHistoryButton(city.name), createDeleteButton(city));
  return historyDiv;
};

/*

Event Handlers

*/

const handleSearchFormSubmit = (event: Event) => {
  event.preventDefault();

  if (!searchInput.value.trim()) {
    alert('City cannot be blank');
    return;
  }

  fetchWeather(searchInput.value.trim()).then(getAndRenderHistory);
  searchInput.value = '';
};

const handleSearchHistoryClick = (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.matches('.history-btn')) {
    fetchWeather(target.textContent || '').then(getAndRenderHistory);
  }
};

const handleDeleteHistoryClick = (event: Event) => {
  event.stopPropagation();
  const target = event.target as HTMLElement;
  const cityData = target.dataset.city ? JSON.parse(target.dataset.city) : null;

  if (cityData?.id) {
    deleteCityFromHistory(cityData.id);
  }
};

/*

Initial Render

*/

const getAndRenderHistory = () => renderSearchHistory();

searchForm?.addEventListener('submit', handleSearchFormSubmit);
searchHistoryContainer?.addEventListener('click', handleSearchHistoryClick);

getAndRenderHistory();
