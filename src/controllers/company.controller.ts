
import { Request, Response } from "express"
import Company from '../models/company.model';
import * as companiesService from '../services/companies.service';

export const getCompanies = async (req: Request, res: Response) => {

    try {

        const companies = await companiesService.getcompanies();

        res.status(200).send(companies);
        
    } catch (error) {

        (error instanceof Error) ? res.status(500).send(error.message) : res.status(500).send(String(error));
        
    }

};
