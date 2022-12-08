
import Game from '../models/game.model';
import { CreateGameDto } from '../dtos/create_game.dto';
import * as generalUtils from '../common/utils/general.utils';
import * as authController from '../controllers/auth.controller';

const genres = [ 'Accion', 'Deportes', 'Aventura', 'Carreras', 'Disparos en tercera persona', 
                 'Shooter', 'Pelea', 'Hack and slash', 'MMORPG', 'Massively Multiplayer', 
                 'Narrativa', 'Entretenimiento', 'Rol', 'Ficción especulativa', 'Rol', 'Disparos táctico'];

const platforms = ['PlayStation 4', 'PlayStation 5', 'PSP', 'PlayStation 3', 'Xbox', 'PC', 'PlayStation', 
                   'Nintendo Switch']

export const getGames = async (_id_company: string) => {

    const games = await Game.find({ _id_company });
    
    if (games.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not games added!' }));

    // games.map(game => {
    //     console.log(game._id);
    // });

    return {
        code: 200,
        count: games.length,
        results: games
    };

};

export const getGameById = async (_id: string) => {

    // console.log(_id.match(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i));

    if (!(generalUtils.validate_id(_id))) throw new Error(JSON.stringify({ code: 400, message: `_id '${_id}' is not valid!` }));

    const game = await Game.findById(_id);

    return game;

};

export const getGamesByName = async (name: string) => {

    const games = await Game.find({ name });

    return games;

};

export const validationAddGame = async (game: CreateGameDto): Promise<CreateGameDto> => {

    const errors = await generalUtils.errorsFromValidate(game);

    if (errors !== undefined) throw new Error(JSON.stringify(errors));

    game.name = generalUtils.formattingWords(game.name);

    const existsGame = await getGamesByName(game.name);

    existsGame.map(game => {
        
        if (game._id_company.toString() === authController.token._id_company) 
            throw new Error(JSON.stringify({ code: 400, message: 'Game already exists!' }));

    });
   
    if (game.genres.length === 0)
        throw new Error(JSON.stringify({ code: 400, message: 'You must enter at least one genre, here are a few examples...', results: genres }));
    
    if (game.platforms.length === 0)
        throw new Error(JSON.stringify({ code: 400, message: 'You must enter at least one platform, here are a few examples...', results: platforms }));
    
    return game;

};
