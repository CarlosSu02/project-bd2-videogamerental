
import User from '../models/user.model';

export const getUsers = async () => {

    const users = await User.find();
    
    if (users.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not users added!' }));

    return {
        code: 200,
        count: users.length,
        results: users
    };

};
