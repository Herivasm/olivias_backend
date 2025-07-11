import mongoose, { Document, Schema } from "mongoose";

export interface ISupplier extends Document {
    supplierName: string
    contact: string
}

const SupplierSchema: Schema = new Schema({
    supplierName: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema)
export default Supplier