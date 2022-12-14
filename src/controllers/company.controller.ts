
import { Request, Response } from "express"
import Company from '../models/company.model';
import User from '../models/user.model';
import * as companiesService from '../services/companies.service';
import * as authController from '../controllers/auth.controller';
import * as usersService from '../services/users.service';
import * as authUtils from '../common/utils/auth.utils';
import { plainToClass } from "class-transformer";
import { CreateCompanyDto } from "../dtos/create_company.dto";
import { ResponseDto } from "../common/dto/response.dto";

export const getCompanies = async (req: Request, res: Response) => {

    try {

        const companies = await companiesService.getCompanies();

        res.status(200).send(companies);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                
    }

};

export const createCompany = async (req: Request, res: Response) => {

    try {

        if (authController.token.role !== 'Owner') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to create company!'}));

        const payload = req.body;

        const createCompanyDto = plainToClass(CreateCompanyDto, payload);
        const validatedCompany = await companiesService.validationAddCompany(createCompanyDto);

        if (await Company.findOne({ owner_email: authController.token.email })) throw new Error(JSON.stringify({ code: 400, message: 'You are already a member of a company!' }));

        const user = await usersService.searchUserByEmail(authController.token.email);

        const newCompany = await Company.create({
            ...validatedCompany,
            owner_email: user?.email
        });

        const response: ResponseDto = {
            code: 201,
            message: 'New company created successfully.',
            results: newCompany
        }

        await User.findOneAndUpdate({ email: user?.email }, { _id_company: newCompany._id });

        // al agregar una compa??ia retorna un token el el id de la compa??ia, de esta forma no vuelve a iniciar sesion.
        const newAccessToken = authUtils.createTokenCookie('access_token', { email: authController.token.email, role: authController.token.role, _id_company: newCompany._id }, process.env.SECRET_KEY_ACCESS_TOKEN!, '1min');

        res.status(response.code!).cookie('access_token', newAccessToken.cookie).send(response);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }

};
