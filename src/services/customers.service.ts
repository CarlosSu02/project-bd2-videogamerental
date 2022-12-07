
import Customer from '../models/customer.model';

export const getCustomers = async () => {

    const users = await Customer.find();
    
    if (users.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not customers added!' }));

    return {
        code: 200,
        count: users.length,
        results: users
    };

};
