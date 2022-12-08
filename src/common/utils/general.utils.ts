
import { validate } from 'class-validator';

// class GeneralUtils {

//     // public errorsFromValidate = async (errors: any) => {

//     //     return await validate(errors).then(errors => {

//     //         if (errors.length > 0) {

//     //             let constraints: any = {
//     //                 code: 400,
//     //                 results: []
//     //             };

//     //             errors.forEach(err => {
                    
//     //                 constraints.results.push({

//     //                     'property': err.property,
//     //                     'errors': err.constraints

//     //                 });

//     //             });

//     //             return constraints;

//     //         }

//     //     });

//     // };

//     public formattingWords = (words: string) => {
        
//         return words.trim().toLowerCase().split(' ').filter(s => s !== '').join(' ').replace(/(^\w{1})|(\s+\w{1})/g, word => word.toUpperCase());

//     };
    
// }

export const errorsFromValidate = async (errors: any) => {
    
    return await validate(errors).then(errors => {

        if (errors.length > 0) {

            let constraints: any = {
                code: 400,
                results: []
            };

            errors.forEach(err => {
                
                constraints.results.push({

                    'property': err.property,
                    'errors': err.constraints

                });

            });

            return constraints;

        }

    });

};

export const formattingWords = (words: string) => {
        
    return words.trim().toLowerCase().split(' ').filter(s => s !== '').join(' ').replace(/(^\w{1})|(\s+\w{1})/g, word => word.toUpperCase());
    
};

export const validate_id = (_id: string) => {

    return _id.match(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i);

};

export const dateReturn = (days: number) => {

    const currentDate = new Date().toLocaleString().split(' ')[0].replace(',', '');
    const matches = currentDate.match(/([\d{2}])\/(\d{2})\/(\d{4})/);

    const currentYear = matches?.[3];
    const currentMonth = matches?.[2];
    const currentDay = matches?.[1];

    const daysMonth = new Date(+currentYear!, +currentMonth!, 0).getDate();

    const dayReturn = (daysMonth < (+currentDay! + days)) ? (+currentDay! + days - daysMonth) : (+currentDay! + days);
    const monthReturn = (daysMonth < (+currentDay! + days)) ? ((+currentMonth! + 1 === 13) ? '1' : +currentMonth! + 1) : (currentMonth);
    const yearReturn = (daysMonth < (+currentDay! + days)) ? ((currentMonth === '12') ? +currentYear! + 1 : currentYear) : (currentYear);

    const dateReturn = new Date(`${yearReturn}/${monthReturn}/${dayReturn}`).toLocaleString().split(' ').filter(zeros => zeros !== '00:00:00').join('') + ' ' + new Date().toLocaleTimeString();

    return dateReturn;

};
