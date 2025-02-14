import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import * as dotenv from 'dotenv'; 
dotenv.config(); // Load .env variables FIRST

// Debugging: Confirm .env is loading
console.log(`PORT from .env: ${process.env.PORT}`);


// Import the routes
import routes from './routes/index.js';
import weatherRoutes from './routes/api/weatherRoutes.js';

const app = express();

// Convert __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routes);

// Debugging: Show registered routes
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`Registered Route: ${middleware.route.path}`);
  }
});

// Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes);

// Start the server on the port
const PORT = process.env.PORT || 3001; // Use .env or fallback to 3001
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
