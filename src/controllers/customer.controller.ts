
import { Request, Response } from "express"
import Customer from '../models/customer.model';
import * as customersService from '../services/customers.service';
import * as authController from '../controllers/auth.controller';
import { plainToClass } from "class-transformer";
import { CreateCustomerDto } from "../dtos/create_customer.dto";
import { ResponseDto } from "../common/dto/response.dto";

export const getCustomers = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list customers!' }));

        const users = await customersService.getCustomers(authController.token._id_company);

        res.status(200).send(users);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};


export const createCustomer = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create customer!'}));

        const payload = req.body;

        const createCustomerDto = plainToClass(CreateCustomerDto, payload);

        createCustomerDto._id_company = authController.token._id_company;

        const validatedCustomer = await customersService.validationAddCustomer(createCustomerDto);

        const newCustomer = await Customer.create({
            ...validatedCustomer
        });

        const response: ResponseDto = {
            code: 201,
            message: 'New company created successfully.',
            results: newCustomer
        }

        res.status(response.code!).send(response);
        
    } catch (error) {

        if (error instanceof Error) {

            console.log(error);
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }
    
};
