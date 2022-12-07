
/*
    {
        "_id": {
            "$oid": "6381aaf246d07e1d771414de"
        },
        "name": "B Games",
        "email": "bgames@gmail.com",
        "phone": 12345678,
        "address": "Santa Rosa de Copan, Honduras",
        "num_branches": 20
    }
*/

import { Schema, Document, model } from "mongoose";

export interface ICompany extends Document {
    name: string,
    email: string,
    phone: number,
    address: string,
    num_branches: number,
    owner_email: string
};

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
    },
    num_branches: {
        type: Number,
        required: true
    },
    owner_email: {
        type: String,
        required: true
    }
});

export default model<ICompany>('Company', companySchema);
