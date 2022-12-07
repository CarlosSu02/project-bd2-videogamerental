
import { Schema, Document, model, StringSchemaDefinition } from "mongoose";

export interface IUser extends Document {
    name: string,
    phone: number,
    email: string,
    password: string
};

const userSchema = new Schema({
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
    }
});

export default model<IUser>('User', userSchema);
