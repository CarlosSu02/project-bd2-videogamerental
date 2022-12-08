
import { Router } from "express";
import * as customerController from '../controllers/customer.controller';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.get('/', authController.verifyToken, customerController.getCustomers)
      .post('/', authController.verifyToken, customerController.createCustomer);

export default router;
