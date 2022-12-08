
import { Request, Response } from "express";
import Report, { IReportCreate } from "../models/report.model";
import * as authController from './auth.controller';
import * as reportsService from '../services/reports.service';

export const getReports = async (req: Request, res: Response) => {

    try {

        if (authController.token.role === 'Employe') 
            throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list games!' }));

        const resports = await reportsService.getReports(authController.token._id_company);

        res.status(200).send(resports);
        
    } catch (error) {

        if (error instanceof Error) {
                            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                
    }

};

export const createReport = async (report: IReportCreate) => {

    try {

        await Report.create(report);
        
    } catch (error) {

        (error instanceof Error) ? console.log(error.message) :  console.log(String(error));
        
    }

};
