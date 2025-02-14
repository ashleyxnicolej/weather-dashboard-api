import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
// import historyService from '../../historyService';
import * as dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

class Weather {
  temperature: number;
  description: string;
  icon: string;

  constructor(temperature: number, description: string, icon: string) {
    this.temperature = temperature;
    this.description = description;
    this.icon = icon;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org/data/2.5';
    this.apiKey = process.env.API_KEY || '';  // Ensure the API key is present
  }

  async getGeoCoordinates(cityName: string) {
    const API_KEY = process.env.API_KEY;
    const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${this.apiKey}`);
    const data: { lat: number; lon: number }[] = response.data as { lat: number; lon: number }[];
  
    if (data.length === 0) {
      throw new Error('City not found');
    }
  
    const { lat, lon } = data[0];
    return { lat, lon };
  }

  async getWeatherData(cityName: string): Promise<any> {
    const coordinates = await this.getGeoCoordinates(cityName);
    const response = await axios.get(`${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`);
    const data = response.data as { cod: number; [key: string]: any };
    if (data.cod !== 200) {
      throw new Error('Failed to fetch weather data');
    }
    return data;
  }

  private parseCurrentWeather(response: any): Weather {
    const { main, weather } = response;
    return new Weather(main.temp, weather[0].description, weather[0].icon);
  }

  async getWeatherForCity(city: string): Promise<Weather> {
    const weatherData = await this.getWeatherData(city);
    return this.parseCurrentWeather(weatherData);
  }
}

export default new WeatherService();
