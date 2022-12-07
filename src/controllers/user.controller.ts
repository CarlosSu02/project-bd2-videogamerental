
import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { UpdateInfoUserDto } from "../dtos/update_info_user.dto";
import Role from "../models/role.model";
import User from "../models/user.model";
import * as usersService from "../services/users.service";
import * as authController from "./auth.controller";
import * as authService from "../services/auth.service";
import * as rolesService from "../services/roles.service";
import { ResponseDto } from "../common/dto/response.dto";
import { SigninUserDto } from "../dtos/signin_user.dto";

// superadmin
export const getUsers = async (req: Request, res: Response) => {

    try {

        if (authController.token.role !== 'Superadmin') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the roles!'}));

        const users = await usersService.getUsers();

        res.status(users.code!).send(users);
        
    } catch (error) {

        if (error instanceof Error) {

            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }

};

export const profile = async (req: Request, res: Response) => {

    try {

        // console.log(authController.token);

        const { email } = authController.token;
        
        const user = await usersService.profile(email);

        const response: ResponseDto = {
            code: 200,
            message: 'Profile.',
            results : user
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

export const updateUser = async (req: Request, res: Response) => {

    try {

        const payload = req.body;
        const { email } = authController.token;
        
        const updateInfoUserDto = plainToClass(UpdateInfoUserDto, payload);
        const validatedUser = await usersService.validationUpdateInfoUser(updateInfoUserDto, email);
        // const user = await User.findOne({ where: { email }, include: [{ model: Role }] });

        // let role;
        // const user = await User.findOne({ email }).then(async (data) => { role = await Role.findById(data?._id_role).then(role => role?.name); return data });
        // const user = await Role.findOne().populate({ path: 'users', select: 'name' });
        
        // const user = await User.findOne({ email }).populate('_id_role');
        const user = await User.findOne({ email }).populate('_id_role');
        
        if (validatedUser.role !== undefined) validatedUser._id_role = (await rolesService.getRoleByName(validatedUser.role).then(data => data?._id));

        user?.set({
            ...validatedUser
        });
        await user?.save();

        const updatedInfoUser = {
            id: user?.id,
            ...validatedUser
        };

        const response: ResponseDto = {
            code: 200,
            message: 'User has been updated successfully.',
            results : updatedInfoUser
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

// Para este de momento, es que la confirmacion de eliminar el perfil sea el inicio de sesion valido.
export const deleteUser = async (req: Request, res: Response) => {

    try {

        const payload = req.body;
        
        if (authController.token.email !== payload.email) throw new Error(JSON.stringify({ code: 400, message: 'Email does not match!' }));

        const signinUserDto = plainToClass(SigninUserDto, payload);
        const validatedUser = await authService.validationSigninUser(signinUserDto);
       
        await User.deleteOne({ email: validatedUser.email }); 
        
        const response: ResponseDto = {
            code: 200,
            message: `The user with email '${validatedUser.email}' deleted successfully.`
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
