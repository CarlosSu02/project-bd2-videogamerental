
import Game from '../models/game.model';

export const getGames = async () => {

    const games = await Game.find();
    
    if (games.length === 0) throw new Error(JSON.stringify({ code: 500, message: 'There are not games added!' }));

    return {
        code: 200,
        count: games.length,
        results: games
    };

};
