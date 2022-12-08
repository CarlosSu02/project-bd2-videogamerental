
import { CreateCompanyDto } from '../dtos/create_company.dto';
import Company from '../models/company.model';
import * as generalUtils from '../common/utils/general.utils';

export const getcompanies = async () => {

    const companies = await Company.find();
    
    if (companies.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not companies added!' }));

    return {
        code: 200,
        count: companies.length,
        results: companies
    };

};

export const searchCompanyByName = async (name: string) => {

    const company = await Company.findOne({ name });

    return company;

};

export const searchCompanyByEmail= async (email: string) => {

    const company = await Company.findOne({ email });
    
    return company;

};

export const validationAddCompany = async (company: CreateCompanyDto): Promise<CreateCompanyDto> => {

    const errors = await generalUtils.errorsFromValidate(company);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    company.name = generalUtils.formattingWords(company.name);

    if (await searchCompanyByName(company.name)) throw new Error(JSON.stringify({ code: 400, message: `Company name '${company.name}' already exists!` }));

    if (await searchCompanyByEmail(company.email)) throw new Error(JSON.stringify({ code: 400, message: `Company email '${company.email}' already used!` }));

    if (company.num_branches <= 0) throw new Error(JSON.stringify({ code: 400, message: 'num_branches must be a minimum of 1!' }));
    
    return company;

};
