
import { formattingWords } from '../common/utils/general.utils';
import Role from '../models/role.model';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateRoleDto } from '../dtos/create_role.dto';
import * as rolesService from '../services/roles.service';
import * as authController from './auth.controller';

const roles = [ 'owner', 'admin', 'employee' ];

// superadmin
export const getRoles = async (req: Request, res: Response) => {

    try {

        // if (authController.token.role !== 'Superadmin') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the roles!'}));

        const roles = await rolesService.getRoles();

        res.status(roles.code!).send(roles);
        
    } catch (error) {

        if (error instanceof Error) {
            
            const info = JSON.parse(error.message);
            return res.status(info.code).send(info);
        
        }
        
        return res.status(500).send(String(error));
        
    }

};

export const createRole = async (req: Request, res: Response) => {

    try {

        if (authController.token.role !== 'Superadmin') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the roles!'}));

        const payload = req.body;

        const createRoleDto = plainToClass(CreateRoleDto, payload);
        const validatedRole = await rolesService.validationAddRole(createRoleDto);

        const newRole = await Role.create({
            ...validatedRole
        });

        const response: ResponseDto = {
            code: 201,
            message: 'New role created successfully.',
            results: newRole
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

export const updateRole = async (req: Request, res: Response) => {

    try {

        if (authController.token.role !== 'Superadmin') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the roles!'}));
    
        const { id } = req.params;

        const role = await rolesService.getRoleById(id);

        const updateRoleDto = plainToClass(CreateRoleDto, req.body);
        const validatedRole = await rolesService.validationAddRole(updateRoleDto);

        role.set({ ...validatedRole });
        await role.save();

        const response: ResponseDto = {
            code: 200,
            message: 'Role updated successfully.',
            results: {
                _id: role._id,
                ...validatedRole
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

// export const deleteRole = async (req: Request, res: Response) => {

//     try {

//         if (authController.token.role !== 'Superadmin') throw new Error(JSON.stringify({ code: 401, message: 'You do not have permission to list the roles!'}));
    
//         const { id } = req.params;

//         const role = await rolesService.getRoleById(+id);

//         await Role.destroy({ where: { id } });

//         const response: ResponseDto = {
//             code: 200,
//             message: `The role '${role.dataValues.type}' deleted successfully.`,
//             results: {
//                 ...role.dataValues
//             }
//         }

//         res.status(response.code!).send(response);
        
//     } catch (error) {

//         if (error instanceof Error) {
            
//             const info = JSON.parse(error.message);
//             return res.status(info.code).send(info);
        
//         }
        
//         return res.status(500).send(String(error));
        
//     }

// };

export const instertRoles = async () => {

    try {

        const countRoles = await Role.countDocuments();

        if (countRoles === 0) {

            roles.map(async (role) => {
                
                await Role.create({
                    name: formattingWords(role)
                });

            });

        }
        
    } catch (error) {

        (error instanceof Error) ? console.log(error.message) :  console.log(String(error));
        
    }

};
