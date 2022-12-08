
import { plainToClass } from "class-transformer";
import { Request, Response } from "express"
import { ResponseDto } from "../common/dto/response.dto";
import { CreateGameDto } from "../dtos/create_game.dto";
import Game from '../models/game.model';
import * as gamesService from '../services/games.service';
import * as authController from './auth.controller';

export const getGames = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list games!' }));

        const games = await gamesService.getGames(authController.token._id_company);

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

export const createGame = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create game!'}));

        const payload = req.body;

        const createGameDto = plainToClass(CreateGameDto, payload);

        createGameDto._id_company = authController.token._id_company;

        const validatedGame = await gamesService.validationAddGame(createGameDto);

        const newGame = await Game.create({
            ...validatedGame,
            companies: validatedGame._id_company,
            for_rent: []
        });

        const response: ResponseDto = {
            code: 201,
            message: 'New company created successfully.',
            results: newGame
        }

        res.status(response.code!).send(response);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }
    
};
