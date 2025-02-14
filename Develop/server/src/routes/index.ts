import { apiRoutes } from './api/index.js'; 
import htmlRoutes from './htmlRoutes.js';


import { Router } from 'express';
const router = Router();


router.use('/api', apiRoutes);
router.use('/', htmlRoutes);

export default router; // ✅ Correct export

