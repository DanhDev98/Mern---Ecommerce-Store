import express from 'express';
import { createProducts, deleteProducts, getAllProducts, getFeaturedProducts, getProductCategory, getRecommendProducts, toggleFeaturedProducts } from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/', protectRoute, adminRoute, getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductCategory);
router.get('/recommenPro', getRecommendProducts);
router.post('/', protectRoute, adminRoute, createProducts);
router.delete('/:id', protectRoute, adminRoute, deleteProducts);
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProducts);


export default router;