
import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as roleController from "../controllers/role.controller";

const router = Router();

router.get('/', authController.verifyToken, roleController.getRoles)
      .post('/', authController.verifyToken, roleController.createRole)
      .patch('/:id', authController.verifyToken, roleController.updateRole)
      .delete('/:id', authController.verifyToken, roleController.deleteRole);

export default router;
