
import { Router } from "express";
import * as authController from '../controllers/auth.controller';
import * as reportController from '../controllers/report.controller';

const router = Router();

router.get('/', authController.verifyToken, reportController.);

export default router;
