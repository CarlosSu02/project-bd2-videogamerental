
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as companyController from '../controllers/company.controller';

const router = Router();

router.get('/', companyController.getCompanies)
      .post('/', authController.verifyToken, companyController.createCompany);

export default router;
