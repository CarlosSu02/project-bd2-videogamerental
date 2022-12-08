
import { Request, Response } from "express"
import * as rentalService from '../services/rental.service';
import * as authController from '../controllers/auth.controller';
import * as reportController from './report.controller';
import { plainToClass } from "class-transformer";
import { CreateRentDto } from "../dtos/create_rent.dto";
import { ResponseDto } from "../common/dto/response.dto";
import Game from '../models/game.model';
import mongoose, { mongo } from "mongoose";
import Bill, { IBillCreate } from "../models/bill.model";
import { UpdateRentDto } from "../dtos/update_rent.dto";

export const createRent = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create rent!'}));

        const payload = req.body;

        const createRentDto = plainToClass(CreateRentDto, payload);
        const validatedRent = await rentalService.validationAddRentGame(createRentDto);

        const gameSave = {
            _id_rent: new mongoose.Types.ObjectId(),
            _id_customer: validatedRent._id_customer,
            date_rental: validatedRent.date_rental,
            date_returned: validatedRent.date_return,
            returned: false
        }

        await Game.findByIdAndUpdate({ _id: validatedRent._id_game }, { $push: { for_rent: gameSave } });

        const newBill: IBillCreate = {
            date: new Date().toLocaleString(),
            rental_price: validatedRent.rental_price,
            deposit_rental: validatedRent.deposit_rental,
            _id_rent: gameSave._id_rent.toString(),
            _id_company: authController.token._id_company
        }

        const bill = await Bill.create(newBill);

        await reportController.createReport({ 
            type: `Create Rent by ${authController.token.email}.`,
            _id_company: authController.token._id_company,
            data: {
                user: authController.token.email,
                _id_bill: bill._id,
                _id_customer: gameSave._id_customer,
                _id_rent: gameSave._id_rent,
                rental_at: new Date().toLocaleString()
            }
        });

        const response: ResponseDto = {
            code: 201,
            message: 'New rent created successfully.',
            results: {
                ...newBill,
                date_returned: gameSave.date_returned
            }
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

export const updateRent = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to update rent!'}));

        const payload = req.body;
        
        const updateRentDto = plainToClass(UpdateRentDto, payload);
        const validatedRent = await rentalService.validationUpdateRent(updateRentDto);

        await Game.findByIdAndUpdate({ _id: validatedRent._id_game }, 
            {
                $set: {
                    "for_rent.$[elem].returned": validatedRent.returned
                },
            }, 
            {
                arrayFilters: [
                    { "elem._id_rent": new mongoose.Types.ObjectId(validatedRent._id_rent) }
                ]
            }
        );

        await reportController.createReport({ 
            type: `Update Rent by ${authController.token.email}.`,
            _id_company: authController.token._id_company,
            data: {
                user: authController.token.email,
                _id_game: validatedRent._id_game,
                _id_rent: validatedRent._id_rent,
                game_returned: validatedRent.returned,
                updated_at: new Date().toLocaleString()
            }
        });

        const response: ResponseDto = {
            code: 200,
            message: 'Rent has been updated successfully.',
            results : (await rentalService.searchRentById(validatedRent.game, authController.token._id_company, validatedRent._id_rent))![0]
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
