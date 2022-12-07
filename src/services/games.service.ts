
import Game from '../models/game.model';
import * as generalUtils from '../common/utils/general.utils'

export const getGames = async () => {

    const games = await Game.find();
    
    if (games.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not games added!' }));

    games.map(game => {
        console.log(game._id);
    });

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
