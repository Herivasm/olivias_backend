import mongoose, { Document, Schema } from "mongoose";

export const productCategories = {
    HOT_DRINKS: 'hotDrinks',
    COLD_DRINKS: 'coldDrinks',
    ALCOHOL: 'alcohol',
    SNACKS: 'snacks',
    HAMBURGUERS: 'hamburguers',
    BAGGUETTES: 'baguettes',
    SANDWICHES: 'sandwiches',
    DESSERTS: 'desserts'
} as const

export type ProductCategory = typeof productCategories[keyof typeof productCategories]

export interface IProduct extends Document {
    productName: string
    price: number
    cost: number
    description: string
    photoUrl?: string
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
    cost: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    photoUrl: {
        type: String,
        required: false,
        trim: true
    },
    category: {
        type: String,
        enum: Object.values(productCategories)
    }
}, { timestamps: true })

const Product = mongoose.model<IProduct>('Product', ProductSchema)
export default Product