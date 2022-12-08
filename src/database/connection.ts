
import mongoose from "mongoose";
import 'dotenv/config';
import * as roleController from '../controllers/role.controller';

mongoose.connect(process.env.MONGODB_URI!)
    .then(() => {
    
        console.log(`Connection has been established successfully. \n`);

        roleController.instertRoles();

    })
    .catch((error) => {
       
        console.log('Unable to connect to the database: ', error);

    });
