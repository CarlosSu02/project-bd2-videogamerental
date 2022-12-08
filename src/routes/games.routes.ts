
import { Router } from "express";
import * as gameController from '../controllers/game.controller';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.get('/', authController.verifyToken, gameController.getGames)
      .get('/:id', authController.verifyToken, gameController.getGameById)
      .post('/', authController.verifyToken, gameController.createGame);

export default router;
