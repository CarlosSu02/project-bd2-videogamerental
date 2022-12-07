
// Roles service
import { ResponseDto } from "../common/dto/response.dto";
import * as generalUtils from "../common/utils/general.utils";
import { CreateRoleDto } from "../dtos/create_role.dto";
import Role from "../models/role.model";
import User from "../models/user.model";

export const getRoles = async (): Promise<ResponseDto> => {

    const searchAllRoles = await Role.find();

    if (searchAllRoles.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not roles added!' }));

    return {
        code: 200,
        message: 'List of all roles.',
        count: searchAllRoles.length,
        results: searchAllRoles 
    };

};

export const getRoleById = async (_id: string) => {

    if (!(generalUtils.validate_id(_id))) throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

    const role = await Role.findById(_id);

    if (role === null) throw new Error(JSON.stringify({ code: 404, message: 'Role is not exists! The following roles exist...', results: (await Role.find({ order: [['id', 'ASC']] })).filter(role => role.name !== 'Owner') }));

    return role;

};

export const getRoleByEmail = async (email: string) => {

    const role = await User.findOne({ where: { email }, include: [{ model: Role }] }).then(info => info?.toJSON());
    
    return role!.role.type;

};

export const getRoleByName = async (name: string) => {

    name = generalUtils.formattingWords(name);

    const role = await Role.findOne({ name })

    // const roles = await Role.find();

    // const arrayRoles = roles.map(role => {

    //     return role.name;

    // });

    // console.log(name, await Role.findOne({ name }));

    // return (arrayRoles.includes(name))
    //          ? await Role.findOne({ where: { name } })
    //          : null;

    return role;

};

export const validationAddRole = async (role: CreateRoleDto): Promise<CreateRoleDto> => {

    const errors = await generalUtils.errorsFromValidate(role);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    role.type = generalUtils.formattingWords(role.type);

    if ((await getRoleByName(role.type)) !== null) throw new Error(JSON.stringify({ code: 400, message: 'Role already exists!' }));

    return role;

};
