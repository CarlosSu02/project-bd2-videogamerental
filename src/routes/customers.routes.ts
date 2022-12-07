
import { Router } from "express";
import * as customerController from '../controllers/customer.controller';

const router = Router();

router.get('/', customerController.getCustomers);

export default router;
