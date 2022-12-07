 
import express, { json } from 'express';
import cors from 'cors';
import customersRoutes from './routes/customers.routes';
import companiesRoutes from './routes/companies.routes';
import gamesRoutes from './routes/games.routes';

const app = express();

app.use(json())
   .use(cors());

app.use('/api/customers', customersRoutes)
   .use('/api/companies', companiesRoutes)
   .use('/api/games', gamesRoutes);

export const listen = (PORT: number) => {

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}, http://localhost:${PORT}/`)
    });

};

