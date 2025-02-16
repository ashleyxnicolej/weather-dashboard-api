import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import * as dotenv from 'dotenv';
dotenv.config();

const validateCityName = (cityName) => {
    return typeof cityName === 'string' && 
           cityName.length >= 2 && 
           cityName.length <= 50;
};

const router = Router();
const API_KEY = process.env.API_KEY; // Use the API key from the environment variable

//added error handling for API KEY 
if (!API_KEY) {
    throw new Error('Weather API key is not configured');
}

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const { cityName } = req.body;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    if (!validateCityName(cityName)) {
        return res.status(400).json({ 
            error: 'Invalid city name. Must be 2-50 characters long.' 
        });
    }
    try {
        const geoResponse = await WeatherService.getGeoCoordinates(cityName);
        const { lat, lon } = geoResponse;
        await HistoryService.addCityToHistory(cityName);
        return res.json({ lat, lon });
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// GET weather data by city name
router.get('/weather', async (req, res) => {
    const cityName = req.query.city;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherResponse = await WeatherService.getWeatherData(cityName);
        await HistoryService.addCityToHistory(cityName);
        return res.json({
            city: weatherResponse.name,
            temperature: weatherResponse.main.temp,
            humidity: weatherResponse.main.humidity,
            weather: weatherResponse.weather[0].description,
            windSpeed: weatherResponse.wind.speed,
            uvIndex: updateVariableStatement.value,
        });
    }
    catch (error) {
        console.error('Error fetching weather data:', error);
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});

// GET 5-day forecast
router.get('/forecast', async (req, res) => {
    const cityName = req.query.city;
    if (!cityName) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const forecastData = await WeatherService.getForecastData(cityName);
        return res.json(forecastData);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        return res.status(500).json({ error: 'Failed to retrieve forecast data' });
    }
});



// GET search history
router.get('/history', async (req, res) => {
    try {
        const searchHistory = await HistoryService.getHistory();
        return res.json({ searchHistory });
    }
    catch (error) {
        console.error('Error fetching search history:', error);
        return res.status(500).json({ error: 'Failed to retrieve search history' });
    }
});
// DELETE city from search history
router.delete('/history/:cityName', async (req, res) => {
    const { cityName } = req.params;
    try {
        const searchHistory = await HistoryService.getHistory();
        const index = searchHistory.indexOf(cityName);
        if (index !== -1) {
            searchHistory.splice(index, 1);
            await HistoryService.updateHistory(searchHistory);
            return res.json({ message: `${cityName} removed from search history.` });
        }
        else {
            return res.status(404).json({ error: 'City not found in search history' });
        }
    }
    catch (error) {
        console.error('Error deleting city from search history:', error);
        return res.status(500).json({ error: 'Failed to delete city from search history' });
    }
});
export default router;
