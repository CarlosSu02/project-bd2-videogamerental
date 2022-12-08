
// User service
import { UpdateInfoUserDto } from "../dtos/update_info_user.dto";
import User from "../models/user.model";
import * as generalUtils from "../common/utils/general.utils";
import * as rolesService from "./roles.service";
import { ResponseDto } from "../common/dto/response.dto";
import Role from "../models/role.model";

// superadmin
export const getUsers = async (): Promise<ResponseDto> => {

    const searchAllUsers = await User.find();

    if (searchAllUsers.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not users added!' }));

    return {
        code: 200,
        message: 'List of all users.',
        count: searchAllUsers.length,
        results: searchAllUsers 
    };

};

export const profile = async (email: string) => {

    // const existsUser = await User.findOne({ attributes: [ 'id', 'name', 'phone', 'address', 'email' ], where: { email } }); 
    const existsUser = await User.findOne({ email }, [ '_id', 'name', 'phone', 'email']).populate('_id_role').populate('_id_company', ['name', 'email', 'address', 'owner_email']).then(data => data?.toJSON()); 

    if (!(existsUser)) throw new Error(JSON.stringify({ error: 404, message: 'User not exists!' }));

    // const role = await rolesService.getRoleById(existsUser._id_role.toString());

    const profile = {
        _id: existsUser._id,
        name: existsUser.name,
        phone: existsUser.phone,
        email: existsUser.email,
        role: existsUser._id_role.name,
        company: existsUser._id_company
    }

    // const userData = {
    //     ...profile,
    //     role: role.name
    // }

    return profile;

};

export const searchUserById = async (_id: number) => {

    const existsUser = await User.findOne({ _id }); 
    
    if (!(existsUser)) throw new Error(JSON.stringify({ error: 404, message: 'User not exists!' }));

    return existsUser;

};

export const searchUserByEmail = async (email: string) => {

    const existsUser = await User.findOne({ email }); 

    return existsUser;

};

export const searchUserInclude = async (email: string, model: any) => {

    const existsUser = await User.findOne({ where: { email }, include: [{ model }] }); 

    return existsUser;

};

export const validationUpdateInfoUser = async (user: UpdateInfoUserDto, email: string): Promise<UpdateInfoUserDto> => {
    
    if (user.name !== undefined) user.name = generalUtils.formattingWords(user.name);

    const errors = await generalUtils.errorsFromValidate(user);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    if (!(await searchUserByEmail(email!))) throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));

    if (user.role !== undefined) {

        user.role = generalUtils.formattingWords(user.role);
        const existsRole =  await rolesService.getRoleByName(user.role)

        if (!(existsRole)) 
            throw new Error(JSON.stringify({ code: 400, message: `The role '${user.role}' is not exists!` }));
        else
            user._id_role = existsRole._id;

    }

    return user;

};
