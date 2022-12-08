
import { CreateCustomerDto } from '../dtos/create_customer.dto';
import Customer from '../models/customer.model';
import * as generalUtils from '../common/utils/general.utils';

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

export const searchCustomersByDni = async (dni: string) => {

    const customers = await Customer.find({ dni });

    return customers;

};

export const validationAddCustomer = async (customer: CreateCustomerDto): Promise<CreateCustomerDto> => {

    const errors = await generalUtils.errorsFromValidate(customer);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    customer.name = generalUtils.formattingWords(customer.name);

    const existsCustomer = await searchCustomersByDni(customer.dni);
    
    existsCustomer?.map(cust => {
        
        if (cust._id_company.toString() === customer._id_company) 
            throw new Error(JSON.stringify({ code: 400, message: 'Customer already exists!' }));
    
    });
    
    // if (existsCustomer && existsCustomer._id_company.toString() === customer._id_company) 
    //     throw new Error(JSON.stringify({ code: 400, message: 'Customer already exists!' }));
    
    return customer;

};
