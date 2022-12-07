
import { Request, Response } from "express"
import Customer from '../models/customer.model';
import * as usersService from '../services/customers.service';

export const getCustomers = async (req: Request, res: Response) => {

    try {

        const users = await usersService.getCustomers();

        res.status(200).send(users);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};
