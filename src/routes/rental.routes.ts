
import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import * as rentController from '../controllers/rent.controller';

const router = Router();

router.post('/game', authController.verifyToken, rentController.createRent)
      .patch('/update', authController.verifyToken, rentController.updateRent);

export default router;
