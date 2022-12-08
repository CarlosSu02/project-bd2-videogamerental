
import { CreateRentDto } from "../dtos/create_rent.dto";
import * as generalUtils from '../common/utils/general.utils';
import * as gamesService from '../services/games.service';
import * as authController from '../controllers/auth.controller';
import * as customersService from '../services/customers.service';
import { UpdateRentDto } from "../dtos/update_rent.dto";

interface IRent {
    _id_game: string,
    _id_customer: string,
    date_rental: string,
    date_return: string,
    returned: boolean,
    deposit_rental: number
    rental_price: number
}

export const searchRentById = async (name: string, _id_company: string, _id_rent: string) => {
    
    const game = await gamesService.getGameByNameAndCompany(name, _id_company);

    const existsRent = game?.for_rent.map((rent: any) => {
        
        if (rent._id_rent.toString() === _id_rent)
            return rent;

    }).filter(data => data !== undefined);

    return existsRent;      

};

export const validationAddRentGame = async (game: CreateRentDto): Promise<IRent> => {

    const errors = await generalUtils.errorsFromValidate(game);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    game.game = generalUtils.formattingWords(game.game);

    const existsGame = await gamesService.getGameByNameAndCompany(game.game, authController.token._id_company);

    if (!existsGame) 
        throw new Error(JSON.stringify({ code: 400, message: 'The game not exists! The following games exist...', results: (await gamesService.getGames(authController.token._id_company)) }));

    const existsCustomer = await customersService.searchCustomerByDniAndCompany(game.dni, authController.token._id_company);

    if (!existsCustomer) 
        throw new Error(JSON.stringify({ code: 400, message: 'Customer not exists! Please add it...' }));   
         
    if (game.days < 0)
        throw new Error(JSON.stringify({ code: 400, message: 'Must be a minimum of 1 day!' }));

    return {
        _id_game: existsGame._id,
        _id_customer: existsCustomer._id,
        date_rental: new Date().toLocaleString(),
        date_return: generalUtils.dateReturn(2),
        returned: false,
        deposit_rental: existsGame.purchase_price / 2,
        rental_price: existsGame.rental_price
    };

};

export const validationUpdateRent = async (game: UpdateRentDto) => {

    const errors = await generalUtils.errorsFromValidate(game);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    const existsGame = await gamesService.getGameByNameAndCompany(game.game, authController.token._id_company);

    if (!existsGame) 
        throw new Error(JSON.stringify({ code: 400, message: 'The game not exists! The following games exist...', results: (await gamesService.getGames(authController.token._id_company)) }));
    
    if (!(generalUtils.validate_id(game._id_rent))) 
        throw new Error(JSON.stringify({ code: 400, message: `_id_rent '${game._id_rent}' is not valid!` }));

    const existsRent = await searchRentById(game.game, authController.token._id_company, game._id_rent);

    if (existsRent!.length === 0)
        throw new Error(JSON.stringify({ code: 400, message: 'The rent not exists!' }));       

    return {
        ...game,
        _id_game: existsGame._id
    };

};
