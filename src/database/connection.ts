
import mongoose from "mongoose";
import 'dotenv/config';

import User, { IUser } from '../models/user.model'

mongoose.connect(process.env.MONGODB_URI!)
    .then(async () => {
    
        console.log(`Connection has been established successfully.`);
        // console.log(mongoose.connection.db);

        console.log(await User.find());


    })
    .catch((error) => {
       
        console.log('Unable to connect to the database: ', error);

    });