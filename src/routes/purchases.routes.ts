
import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import * as purchaseController from '../controllers/purchase.controller';

const router = Router();

router.get('/bills', authController.verifyToken, purchaseController.getPurchases)
      .post('/game', authController.verifyToken, purchaseController.createPurchase);

export default router;
