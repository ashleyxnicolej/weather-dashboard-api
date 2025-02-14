import express from 'express';
import { Router } from 'express';
import cors from 'cors';
import weatherRoutes from './weatherRoutes.js'; // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 3001;
const router = Router();

app.use(cors());
app.use(express.json());
app.use('/api', weatherRoutes); // ✅ This makes sure /api/weather is a valid endpoint

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

router.use('/weather', weatherRoutes);

export { router as apiRoutes };
