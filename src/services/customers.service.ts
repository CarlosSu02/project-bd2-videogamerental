
import { CreateCustomerDto } from '../dtos/create_customer.dto';
import Customer from '../models/customer.model';
import * as generalUtils from '../common/utils/general.utils';
import * as authController from '../controllers/auth.controller';

export const getCustomers = async (_id_company: string) => {

    const users = await Customer.find({ _id_company });
    
    if (users.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not customers added!' }));

    return {
        code: 200,
        count: users.length,
        results: users
    };

};

export const searchCustomerByDni = async (dni: string) => {

    const customer = await Customer.findOne({ dni });

    return customer;

};

export const searchCustomerByDniAndCompany = async (dni: string, _id_company: string) => {

    const customer = await Customer.findOne({ dni, _id_company });

    return customer;

};

export const validationAddCustomer = async (customer: CreateCustomerDto): Promise<CreateCustomerDto> => {

    const errors = await generalUtils.errorsFromValidate(customer);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    customer.name = generalUtils.formattingWords(customer.name);

    const existsCustomer = await searchCustomerByDniAndCompany(customer.dni, authController.token._id_company);

    if (existsCustomer) 
        throw new Error(JSON.stringify({ code: 400, message: 'Customer already exists!' }));   
    
    return customer;

};
