
/*
    {
        "_id": {
            "$oid": "6381ab9d46d07e1d771414e2"
        },
        "name": "GTA-V",
        "purchase_price": 100,
        "rental_price": 10,
        "genre": [
            "Accion",
            "Aventura",
            "Carreras"
        ],
        "platform": [
            "PC",
            "Xbox",
            "PlayStation"
        ],
        "stock": 100,
        "for_rent": [],
        "company": [
            {
                "_id_company": {
                "$oid": "6381aaf246d07e1d771414de"
                }
            }
        ]
    }
*/

import { Schema, Document, model } from "mongoose";

export interface IGame extends Document {
    name: string,
    purchase_price: number,
    rental_price: number,
    genres: string[],
    platforms: string[],
    stock: number
    for_rent: [],
    _id_company: string
};

const gameSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        purchase_price: {
            type: String,
            required: true
        },
        rental_price: {
            type: Number,
            required: true
        },
        genres: {
            type: Array,
            required: true
        },
        platforms: {
            type: Array,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        for_rent: {
            type: Array,
            required: true
        },
        _id_company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
    },
    {
        versionKey: false
    }
);

export default model<IGame>('Game', gameSchema);
