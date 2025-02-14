import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import * as dotenv from 'dotenv';
dotenv.config();

const router = Router();
const API_KEY = process.env.API_KEY; // Use the API key from the environment variable

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const geoResponse = await WeatherService.getGeoCoordinates(cityName);
    const { lat, lon } = geoResponse;

    await HistoryService.addCityToHistory(cityName);

    return res.json({ lat, lon });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET weather data by city name
router.get('/weather', async (req: Request, res: Response) => {
  const cityName = req.query.city as string;

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
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});


// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const searchHistory = await HistoryService.getHistory();
    return res.json({ searchHistory });
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:cityName', async (req: Request, res: Response) => {
  const { cityName } = req.params;

  try {
    const searchHistory = await HistoryService.getHistory();
    const index = searchHistory.indexOf(cityName);
    if (index !== -1) {
      searchHistory.splice(index, 1);
      await HistoryService.updateHistory(searchHistory);
      return res.json({ message: `${cityName} removed from search history.` });
    } else {
      return res.status(404).json({ error: 'City not found in search history' });
    }
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;

