import express from 'express';
import { createProducts, deleteProducts, getAllProducts, getFeaturedProducts, getRecommendProducts } from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/',protectRoute,  adminRoute , getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/recommenPro', getRecommendProducts);
router.post('/',protectRoute,  adminRoute , createProducts);
router.post('/:id',protectRoute,  adminRoute , deleteProducts );

export default router;