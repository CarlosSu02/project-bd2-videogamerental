
import { Request, Response } from "express"
import User from '../models/user.model';
import * as usersService from '../services/users.service';

export const getUsers = async (req: Request, res: Response) => {

    try {

        const users = await usersService.getUsers();

        res.status(200).send(users);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};
