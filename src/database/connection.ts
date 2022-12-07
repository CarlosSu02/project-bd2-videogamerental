
import mongoose from "mongoose";
import 'dotenv/config';
import * as roleController from '../controllers/role.controller';

// import User, { IUser } from '../models/user.model'

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
    
        console.log(`Connection has been established successfully. \n`);
        // console.log(mongoose.connection.db);

        // console.log(await User.find());

        roleController.instertRoles();

    })
    .catch((error) => {
       
        console.log('Unable to connect to the database: ', error);

    });
