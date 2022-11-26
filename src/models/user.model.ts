
import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
    name: string,
    phone: number,
    address: string
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

export default model<IUser>('User', userSchema);
