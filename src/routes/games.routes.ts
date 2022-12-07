
import { Router } from "express";
import * as gameController from '../controllers/game.controller';

const router = Router();

router.get('/', gameController.getGames)
      .get('/:id', gameController.getGameById);

export default router;
