
import { Router } from "express";
import * as companyController from '../controllers/company.controller';

const router = Router();

router.get('/', companyController.getCompanies);

export default router;