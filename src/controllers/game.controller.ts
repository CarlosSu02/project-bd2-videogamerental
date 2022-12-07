
import { Request, Response } from "express"
import Game from '../models/game.model';
import * as gamesService from '../services/games.service';

export const getGames = async (req: Request, res: Response) => {

    try {

        const games = await gamesService.getGames();

        res.status(200).send(games);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};

export const getGameById = async (req: Request, res: Response) => {

    try {

        const { id } = req.params;

        const games = await gamesService.getGameById(id);

        res.status(200).send(games);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};
