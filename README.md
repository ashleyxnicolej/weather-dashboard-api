# Weather Dashboard

This project is a Weather Dashboard application that allows users to search for weather information by city name. It provides current weather data and a 5-day forecast. The application also maintains a search history.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API](#api)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ashleyxnicolej/weather-dashboard-api.git
   cd weather-dashboard

2. Install dependencies for both client and server:
   ```
   npm install

   cd client

   npm install

   cd ../server

   npm install


## Usage
1. Start the development server:
npm run dev

2. Open your browser and navigate to http://localhost:3000 to view the application.



## Project Structure
.
├── .npmrc
├── client/
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── main.js
│   │   ├── main.ts
│   │   ├── styles/
│   │   │   └── jass.css
│   │   └── vite-env.d.ts
├── server/
│   ├── .env
│   ├── .gitignore
│   ├── db/
│   │   ├── db.json
│   │   └── searchHistory.json
│   ├── package.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   ├── index.ts
│   │   │   │   └── weatherRoutes.ts
│   │   │   ├── htmlRoutes.ts
│   │   │   └── index.ts
│   │   ├── server.ts
│   │   ├── service/
│   │   │   ├── historyService.ts
│   │   │   └── weatherService.ts
│   └── tsconfig.json
└── tsconfig.json


## API 
Endpoints
- POST /api/weather/
  - Request body: { "cityName": "City Name" }
  - Response: { "lat": number, "lon": number }
  
- GET /api/weather/weather?city=CityName
  - Response: { "city": string, "temperature": number, "humidity": number, "weather": string, "windSpeed": number }

- GET /api/weather/history
  - Response: { "searchHistory": string[] }

- DELETE /api/weather/history/:cityName
  - Response: { "message": string }


## Environment Variables
Create a .env file in the server directory with the following content:
API_BASE_URL=https://api.openweathermap.org

API_KEY=your_openweathermap_api_key

PORT=3002


## Scripts

Client
  - npm start: Start the Vite development server.
  - npm run dev: Start the Vite development server.
  - npm run build: Build the client for production.
  - npm run preview: Preview the production build.

Server
  - npm run build: Compile TypeScript files.
  - npm run dev: Start the server with Nodemon for development.
  - npm start: Start the compiled server.

## Dependencies
Client
  - dayjs: ^1.11.10
  - typescript: ^5.4.5
  - vite: ^5.2.0

Server
  - dayjs: ^1.11.10
  - dotenv: ^16.4.5
  - express: ^4.19.2
  - uuid: ^9.0.1
  - typescript: ^5.4.5
  - nodemon: ^3.1.0

## License
This project is licensed under the ISC License.
Feel free to customize this README file further based on your specific requirements.
