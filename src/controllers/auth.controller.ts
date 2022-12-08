
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { SignupUserDto } from "../dtos/signup_user.dto";
import User from "../models/user.model";
import Role from "../models/role.model";
import Company from "../models/company.model";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { SigninUserDto } from "../dtos/signin_user.dto";
import { IPayload } from "../common/utils/auth.utils";
import { ChangePasswordDto } from "../dtos/change_password.dto";
import { ResponseDto } from "../common/dto/response.dto";
import * as authService from "../services/auth.service";
import * as authUtils from "../common/utils/auth.utils";
import * as rolesService from "../services/roles.service";
import * as usersService from "../services/users.service";
import * as companiesService from "../services/companies.service";
import * as reportController from './report.controller';

export let token!: IPayload;

export const ping = (req: Request, res: Response) => {

    const response: ResponseDto = {
        code: 200,
        message: 'Hello strange! 👋🏻'
    }

    res.status(response.code!).send(response);

};

// Registrarse
export const signup = async (req: Request, res: Response) => {

    try {

        const payload = req.body;
        
        const signupUserDto = plainToClass(SignupUserDto, payload);
        const validatedUser = await authService.validationSignupUser(signupUserDto);

        const existsRole = await rolesService.getRoleByName(validatedUser.role);
        if (!existsRole) throw new Error(JSON.stringify({ code: 400, message: `The role '${validatedUser.role}' is not exists!` }));

        if (existsRole.name !== 'Owner') {

            if (await User.countDocuments() === 0)
                throw new Error(JSON.stringify({ code: 400, message: `This is the first run of the application, the role must be 'Owner'.` }));

            if (await Company.countDocuments() === 0)
                throw new Error(JSON.stringify({ code: 400, message: `To sign up, there must be at least one existing company, at this time there are none registered.` }));

            if (validatedUser.company_email === undefined)
                throw new Error(JSON.stringify({ code: 400, message: `You need to enter 'company_email' in order to associate it to a company.` }));

            if (!(await companiesService.searchCompanyByEmail(validatedUser.company_email)))
                throw new Error(JSON.stringify({ code: 400, message: `Company email '${validatedUser.company_email}' is not exists!` }));
        
        }
        
        const newUser = await User.create({ 
            ...validatedUser,
            _id_role: existsRole._id,
            _id_company: (await companiesService.searchCompanyByEmail(validatedUser.company_email))?._id
        });

        if (newUser._id_company !== undefined) {

            await reportController.createReport({ 
                type: `${newUser.name} '${newUser.email}' joined in company.`,
                _id_company: newUser._id_company,
                data: {
                    user: newUser.email,
                    role: existsRole.name,
                    _id_user: newUser._id,
                    joined_at: new Date().toLocaleString()
                }
            });

        }

        // Token
        const accessToken = authUtils.createTokenCookie('access_token', { email: validatedUser.email, role: existsRole.name, _id_company: newUser._id_company }, process.env.SECRET_KEY_ACCESS_TOKEN!, '1min');
        const refreshToken = authUtils.createTokenCookie('refresh_token', { email: validatedUser.email }, process.env.SECRET_KEY_REFRESH_TOKEN!, '1day');
        
        const response: ResponseDto = {
            code: 201,
            message: 'New user created successfully. Please sign in to the application for use.',
            results: newUser
        };

        res.status(response.code!).cookie('access_token', accessToken.cookie).cookie('refresh_token', refreshToken.cookie).header('Cache-Control', `auth-token: ${accessToken.token}`).send(response);

    } catch (error) {

        if (error instanceof Error) {
            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                    
    }

};

// Iniciar sesion
export const signin = async (req: Request, res: Response) => {

    try {

        const payload = req.body;
        
        const signinUserDto = plainToClass(SigninUserDto, payload);
        const validatedUser = await authService.validationSigninUser(signinUserDto);

        const user = await usersService.searchUserByEmail(validatedUser.email);

        const _id_role = user?._id_role.toString();

        const role = await rolesService.getRoleById(_id_role!).then(info => info?.toJSON());

        const signinUser = {
            id: user!._id,
            ...validatedUser,
            role: role.name
        };

        const response: ResponseDto = {
            code: 200,
            message: 'Successful login.',
            results: signinUser
        };

        // Tokens
        const accessToken = authUtils.createTokenCookie('access_token', { email: validatedUser.email, role: role.name, _id_company: user?._id_company }, process.env.SECRET_KEY_ACCESS_TOKEN!, '1min');
        const refreshToken = authUtils.createTokenCookie('refresh_token', { email: validatedUser.email }, process.env.SECRET_KEY_REFRESH_TOKEN!, '1day');

        res.status(response.code!).cookie('access_token', accessToken.cookie).cookie('refresh_token', refreshToken.cookie).header('Cache-Control', `auth-token: ${accessToken.token}`).send(response);

    } catch (error) {

        if (error instanceof Error) {
            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));

    }

};

// Cerrar sesion
export const signout = async (req: Request, res: Response) => {

    try {

        const response: ResponseDto = {
            code: 200,
            message: 'Session ended, if you wish to use the application again, please sign in again.'
        }

        res.status(response.code!).cookie('access_token', '').cookie('refresh_token', '').send(response);

    } catch (error) {

        if (error instanceof Error) {
            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                          
    }

};

// Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {

    try {

        const payload = req.body;

        if (token.email !== payload.email) throw new Error(JSON.stringify({ code: 400, message: 'Email does not match!' }));
        
        const changePasswordDto = plainToClass(ChangePasswordDto, payload);
        const validatedUser = await authService.changePassword(changePasswordDto);

        const user = await usersService.searchUserByEmail(validatedUser.email);

        const _id_role = user?._id_role.toString();

        const role = await rolesService.getRoleById(_id_role!).then(info => info?.toJSON());
        
        user?.set({
            password: validatedUser.new_password
        });
        await user?.save();

        const changedPassword = {
            id: user?.id,
            email: user?.email,
            old_password: validatedUser.password,
            new_password: validatedUser.new_password,
            role: role?.name
        };

        const response: ResponseDto = {
            code: 200,
            message: 'Password has been changed successfully.',
            results: changedPassword
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

// Verificar Token
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    try {

        // console.log(req.cookies);
        // console.log(req.rawHeaders);

        const cookieRefreshToken = (req.cookies.refresh_token !==  undefined) ? req.cookies.refresh_token.split(' ').find((d: string) => d.match(/(refresh_token\=)+([\w]+)/)) : null;
        const refreshToken = (cookieRefreshToken) ? cookieRefreshToken.match(/(refresh_token\=)+?([\w]+\.(\w+\.)+[\w\-]+)/)[2] : null;
        
        const cookieAccessToken = (req.cookies.access_token !==  undefined) ? req.cookies.access_token.split(' ').find((d: string) => d.match(/(access_token\=)+([\w]+)/)) : null;
        
        const accessToken = ((cookieAccessToken) ? cookieAccessToken.match(/(access_token\=)+?([\w]+\.(\w+\.)+[\w\-]+)/)[2] : null) ??
            req.header('auth-token') ?? 
            ((req.rawHeaders.includes('Authorization') && req.rawHeaders.some(f => (/(Bearer auth-token: )+?([\w]+\.(\w+\.)+[\w\-])+/).test(f))) 
            ? req.rawHeaders.find(f => f.match(/(Bearer auth-token: )+?/))!.replace(/(Bearer auth-token: )+?/, '') 
            : null);
            
        if (!accessToken || !refreshToken) throw new Error(JSON.stringify({ code: 401, message: 'Access denied! Please sign in again.' }));

        const validatedRefreshToken = authUtils.verifyTokenPayload(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN!);
        if (typeof validatedRefreshToken === 'string') throw new Error(JSON.stringify({ code: 400, message: 'Token invalid! Please sign in again.' })); 

        let validatedAccessToken = authUtils.verifyTokenPayload(accessToken, process.env.SECRET_KEY_ACCESS_TOKEN!);
        
        if (typeof validatedAccessToken === 'string') { 

            if (validatedAccessToken === 'jwt expired') {
                
                const decode = jwt.decode(accessToken, { complete: true });
                const payload = decode?.payload as IPayload;
                
                const newAccessToken = authUtils.createTokenCookie('access_token', { email: payload.email, role: payload.role, _id_company: payload._id_company }, process.env.SECRET_KEY_ACCESS_TOKEN!, '1min');

                validatedAccessToken = authUtils.verifyTokenPayload(newAccessToken.token, process.env.SECRET_KEY_ACCESS_TOKEN!) as IPayload;

                res.cookie('access_token', newAccessToken.cookie);

            } else {
        
                throw new Error(JSON.stringify({ code: 400, message: 'Token invalid! Please sign in again.' })); 
        
            }
        
        }

        if (!(await usersService.searchUserByEmail(validatedAccessToken!.email!))) throw new Error(JSON.stringify({ code: 404, message: 'User not found!' }));

        token = validatedAccessToken!;

        next();
       
    } catch (error) {

        if (error instanceof Error) {
            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
                                
    }
    
};
