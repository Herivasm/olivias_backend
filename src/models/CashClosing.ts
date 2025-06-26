// En: src/models/CashClosing.ts

import mongoose, { Document, Schema } from "mongoose";

export interface ICashClosing extends Document {
    closingDate: Date;
    initialFund: number;
    totalSales: number;
    cashSales: number;
    transactionSales: number;
    expectedCashInBox: number;
    finalBalance: number;
    notes?: string;
}

const CashClosingSchema: Schema = new Schema({
    closingDate: {
        type: Date,
        required: true,
        unique: true,
    },
    initialFund: {
        type: Number,
        required: true,
    },
    totalSales: {
        type: Number,
        required: true,
    },
    cashSales: {
        type: Number,
        required: true,
    },
    transactionSales: {
        type: Number,
        required: true,
    },
    expectedCashInBox: {
        type: Number,
        required: true,
    },
    finalBalance: {
        type: Number,
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    }
}, { timestamps: true });

const CashClosing = mongoose.model<ICashClosing>('CashClosing', CashClosingSchema);
export default CashClosing;