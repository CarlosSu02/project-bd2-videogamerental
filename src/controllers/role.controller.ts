
import { formattingWords } from '../common/utils/general.utils';
import Role from '../models/role.model';

const roles = [ 'owner', 'admin', 'employee' ];

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
