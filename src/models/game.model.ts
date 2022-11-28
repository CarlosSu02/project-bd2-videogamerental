
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
    genre: string[],
    platform: string[],
    stock: number
    for_rent: [],
    company: []
};

const gameSchema = new Schema({
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
    genre: {
        type: Array,
        required: true
    },
    platform: {
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
    company: {
        type: Array,
        required: true
    },
});

export default model<IGame>('Game', gameSchema);
