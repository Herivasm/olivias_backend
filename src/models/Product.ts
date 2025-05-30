import mongoose, { Document, Schema } from "mongoose";

const productCategory = {
    HOT_DRINK: 'hotDrink',
    COLD_DRINK: 'coldDrink',
    DISH: 'dish',
    DESSERT: 'dessert'
} as const

export type ProductCategory = typeof productCategory[keyof typeof productCategory]

export interface IProduct extends Document {
    productName: string
    price: number
    description: string
    imageUrl?: string
    category: ProductCategory
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
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    category: {
        type: String,
        enum: Object.values(productCategory),
        required: true
    }
}, { timestamps: true })

const Product = mongoose.model<IProduct>('Product', ProductSchema)
export default Product