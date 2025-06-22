import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISupply extends Document {
    supplyName: string
    stock: number
    measure: string
    supplier: Types.ObjectId
}

const SupplySchema: Schema = new Schema({
    supplyName: {
        type: String,
        required: true,
        trim: true,
    },
    measure: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    }
})

const Supply = mongoose.model<ISupply>('Supply', SupplySchema)
export default Supply
