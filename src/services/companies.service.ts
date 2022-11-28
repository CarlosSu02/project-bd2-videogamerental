
import Company from '../models/company.model';

export const getcompanies = async () => {

    const companies = await Company.find();
    
    if (companies.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not companies added!' }));

    return {
        code: 200,
        count: companies.length,
        results: companies
    };

};
