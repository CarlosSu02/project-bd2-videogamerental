
import { CreatePurchaseDto } from "../dtos/create_purchase.dto";
import * as generalUtils from '../common/utils/general.utils';
import * as gamesService from './games.service';
import * as authController from '../controllers/auth.controller';
import * as customersService from './customers.service';
import { UpdateRentDto } from "../dtos/update_rent.dto";
import Bill from '../models/bill.model';

interface IPurchase {
    date: string,
    amount: number,
    total_purchase_price: number,
    new_stock: number,
    _id_game: string,
    _id_company: string
}

export const getPurchases = async (_id_company: string) => {

    const bills = await Bill.find({ _id_company });
    
    if (bills.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not bills added!' }));

    return {
        code: 200,
        count: bills.length,
        results: bills
    };

};

export const validationAddPurchase = async (game: CreatePurchaseDto): Promise<IPurchase> => {

    const errors = await generalUtils.errorsFromValidate(game);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    game.game = generalUtils.formattingWords(game.game);

    const existsGame = await gamesService.getGameByNameAndCompany(game.game, authController.token._id_company);

    if (!existsGame) 
        throw new Error(JSON.stringify({ code: 400, message: 'The game not exists! The following games exist...', results: (await gamesService.getGames(authController.token._id_company)) }));

    if (game.amount <= 0) 
        throw new Error(JSON.stringify({ code: 400, message: 'To make a purchase you must place at least 1 unit.' }));

    if (existsGame.stock === 0) 
        throw new Error(JSON.stringify({ code: 400, message: `Sorry, there are no units available of the game '${game.game}'.` }));
            
    if (existsGame.stock < game.amount) 
        throw new Error(JSON.stringify({code: 400, message: `'${game.game}' does not have ${game.amount} the units you request, select a quantity less than or equal to ${existsGame.stock} units.` }));

    return {
        date: new Date().toLocaleString(),
        amount: game.amount,
        total_purchase_price: existsGame.purchase_price * game.amount,
        new_stock: existsGame.stock - game.amount,
        _id_game: existsGame._id,
        _id_company: authController.token._id_company
    };

};
