import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
    productName: string,
    price: number,
    description: string
}

const ProductSchema: Schema = new Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true })

const Product = mongoose.model<IProduct>('Product', ProductSchema)
export default Product