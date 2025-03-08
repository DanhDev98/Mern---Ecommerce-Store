import express from 'express';
import { login, logout, refreshTokens, signup } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);
router.post("/refresh-token", refreshTokens);

export default router;