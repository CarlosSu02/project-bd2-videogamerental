 
import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import customersRoutes from './routes/customers.routes';
import companiesRoutes from './routes/companies.routes';
import gamesRoutes from './routes/games.routes';
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import rolesRoutes from './routes/roles.routes';
import reportsRoutes from './routes/reports.routes';
import rentalRoutes from './routes/rental.routes';
import purchasesRoutes from './routes/purchases.routes';

const app = express();

app.use(json())
   .use(cors())
   .use(cookieParser());

app.use('/api/customers', customersRoutes)
   .use('/api/companies', companiesRoutes)
   .use('/api/games', gamesRoutes)
   .use('/api/auth', authRoutes)
   .use('/api/user', usersRoutes)
   .use('/api/roles', rolesRoutes)
   .use('/api/reports', reportsRoutes)
   .use('/api/rental', rentalRoutes)
   .use('/api/purchases', purchasesRoutes);

export const listen = (PORT: number) => {

    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}, http://localhost:${PORT}/`)
    });

};

