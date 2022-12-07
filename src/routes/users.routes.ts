
import { Router } from "express";
import * as userController from '../controllers/user.controller';
import * as authController from '../controllers/auth.controller'

const router = Router();

router.get('/', userController.getUsers)
      .get('/users', authController.verifyToken, userController.getUsers)
      .get('/profile', authController.verifyToken, userController.profile)
      .patch('/update', authController.verifyToken, userController.updateUser)
      .delete('/delete', authController.verifyToken, userController.deleteUser);

export default router;
