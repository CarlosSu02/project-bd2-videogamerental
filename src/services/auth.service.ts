
// Auth service
import { SignupUserDto } from "../dtos/signup_user.dto";
import * as authUtils from "../common/utils/auth.utils";
import { SigninUserDto } from "../dtos/signin_user.dto";
import { ChangePasswordDto } from "../dtos/change_password.dto";
import * as rolesService from "./roles.service";
import * as  generalUtils from "../common/utils/general.utils";
import * as userService from "./users.service";

export const validationSignupUser = async (user: SignupUserDto): Promise<SignupUserDto> => {

    const errors = await generalUtils.errorsFromValidate(user);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    user.email = (user.email).toLowerCase();
    user.name = generalUtils.formattingWords(user.name);

    if (user.company_email !== undefined) user.company_email = (user.company_email).toLowerCase();

    if ((await userService.searchUserByEmail(user.email!))) throw new Error(JSON.stringify({ code: 400, message: 'User already exists!' }));
    
    // await rolesService.getRoleByName(user.role);
    // await rolesService.getRoleById(user.roleId!);

    if (user.password !== user.confirm_password) throw new Error(JSON.stringify({ code: 400, message: 'Password confirmation has failed, please check if they are the same.' }));
    
    user.password = await authUtils.encryptPassword(user.password!);

    return user;

};

export const validationSigninUser = async (user: SigninUserDto): Promise<SigninUserDto> => {

    const errors = await generalUtils.errorsFromValidate(user);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    user.email = (user.email).toLowerCase();

    const { email, password } = user;

    if (!(await userService.searchUserByEmail(email))) throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));
    if (!(await authUtils.validatePassword(email, password))) throw new Error(JSON.stringify({ code: 400, message: 'Password is not valid!' }));

    user.password = await authUtils.encryptPassword(password);

    return user;

};

export const changePassword = async (user: ChangePasswordDto): Promise<ChangePasswordDto> => {
    
    const errors = await generalUtils.errorsFromValidate(user);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));
    
    user.email = (user.email).toLowerCase();

    const { email, password, new_password, confirm_new_password } = user;

    if (password === new_password) throw new Error(JSON.stringify({ code: 400, message: 'The new password must be different!' }));
    if (new_password !== confirm_new_password) throw new Error(JSON.stringify({ code: 400, message: 'New password confirmation failed, please check if they are the same.' }));

    if (!(await userService.searchUserByEmail(email!))) throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));
    if (!(await authUtils.validatePassword(email!, password!))) throw new Error(JSON.stringify({ code: 400, message: 'Password is not valid!' }));

    user.password = await authUtils.encryptPassword(password);
    user.new_password = await authUtils.encryptPassword(new_password);

    return user;

};
