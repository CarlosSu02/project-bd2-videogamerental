
import { Schema, Document, model } from "mongoose";
import bcrypt from 'bcrypt';
import Company from '../models/company.model';

export interface IUser extends Document {
    name: string,
    phone: number,
    email: string,
    password: string,
    _id_role: string
};

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        _id_role: {
            type: Schema.Types.ObjectId,
            ref: "Company"
        },
        _id_company: {
            type: Schema.Types.ObjectId,
            ref: "Company"
        }
    },
    {
        versionKey: false
    }
);

// userSchema.statics.encryptPassword = async (password: string) => {
  
//     const salt = await bcrypt.genSalt(10);

//     return bcrypt.hash(password, salt);

// };

// userSchema.statics.validatePassword = async (email: string, password: string) => {

//     // const user = await usersService.searchUserByEmail(email).then(info => info?.toJSON());
    
//     if (!'user') throw new Error(JSON.stringify({ code: 404, message: 'User not exists!' }));
    
//     return bcrypt.compare(password, 'user.password');
    
// };

export default model<IUser>('User', userSchema);
