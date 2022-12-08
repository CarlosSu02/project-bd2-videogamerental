
import { Request, Response } from "express"
import * as purchasesService from '../services/puchases.service';
import * as authController from '../controllers/auth.controller';
import * as reportController from './report.controller';
import { plainToClass } from "class-transformer";
import { ResponseDto } from "../common/dto/response.dto";
import Game from '../models/game.model';
import mongoose, { mongo } from "mongoose";
import Bill, { IBillCreate } from "../models/bill.model";
import { UpdateRentDto } from "../dtos/update_rent.dto";
import { CreatePurchaseDto } from "../dtos/create_purchase.dto";

export const getPurchases = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list bills!' }));

        const bills = await purchasesService.getPurchases(authController.token._id_company);

        res.status(200).send(bills);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                
    }

};

export const createPurchase = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create rent!'}));

        const payload = req.body;

        const createPurchaseDto = plainToClass(CreatePurchaseDto, payload);
        const validatedPurchase = await purchasesService.validationAddPurchase(createPurchaseDto);

        const newBill = await Bill.create(validatedPurchase);

        const response: ResponseDto = {
            code: 201,
            message: 'New rent created successfully.',
            results: {
                ...newBill.toJSON(),
            }
        }

        await Game.findByIdAndUpdate({ _id: validatedPurchase._id_game  }, { stock: validatedPurchase.new_stock });

        await reportController.createReport({ 
            type: `Create Purchase by ${authController.token.email}.`,
            _id_company: authController.token._id_company,
            data: {
                user: authController.token.email,
                _id_bill: newBill._id,
                _id_game: validatedPurchase._id_game,
                created_at: new Date().toLocaleString()
            }
        });

        res.status(response.code!).send(response);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }
    
};
