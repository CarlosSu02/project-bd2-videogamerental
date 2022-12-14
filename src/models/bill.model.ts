
import { Document, model, Schema } from "mongoose";

export interface IBillCreate {
    date: string,
    total_purchase_price?: number,
    amount?: number,
    rental_price?: number,
    deposit_rental?: number,
    _id_rent?: string,
    _id_company: string
}

export interface IBill extends Document {
    date: string,
    total_purchase_price?: number,
    amount?: number,
    rental_price?: number,
    deposit_rental?: number,
    _id_rent?: string,
    _id_company: string
}

const billSchema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        total_purchase_price: {
            type: Number
        },
        amount: {
            type: Number
        },
        rental_price: {
            type: Number
        },
        deposit_rental: {
            type: Number
        },
        _id_rent: {
            type: Schema.Types.ObjectId
        },
        _id_company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<IBill>('Bill', billSchema);
