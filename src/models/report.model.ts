
import { Document, model, Schema } from "mongoose";

export interface IReportCreate {
    type: string,
    _id_company: string,
    data: {}
}

export interface IReport extends Document {
    type: string,
    _id_company: string,
    data: {}
}

const reportSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
        },
        _id_company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        data: {
            type: Object,
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<IReport>('Report', reportSchema);
