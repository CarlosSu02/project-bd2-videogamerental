
import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

router/*.get('/ping', authController.ping)*/
      .post('/signup', authController.signup)
      .post('/signin', authController.signin)
      .patch('/change_password', authController.verifyToken, authController.changePassword)
      .delete('/signout', authController.signout);

export default router;

// const allMusic = await User.findAll({ where: { userId }, include: [{ model: Music, attributes: ['title'] }] });