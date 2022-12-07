
import { Schema, Document, model } from "mongoose";

export interface ICustomer extends Document {
    name: string,
    dni: string,
    phone: number,
    address: string
};

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dni: {
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

export default model<ICustomer>('Customer', customerSchema);
