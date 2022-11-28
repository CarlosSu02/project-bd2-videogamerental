 
import express, { json } from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes';
import companiesRoutes from './routes/companies.routes';
import gamesRoutes from './routes/games.routes';

const app = express();

app.use(json());
app.use(cors());

app.use('/api/users', usersRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/games', gamesRoutes);

export const listen = (PORT: number) => {

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}, http://localhost:${PORT}/`)
    });

};

