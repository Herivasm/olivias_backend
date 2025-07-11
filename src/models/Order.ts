import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IProduct } from "./Product";

export const orderStatus = {
    PENDING: 'pending',
    PAID: 'paid',
} as const

export type OrderStatus = typeof orderStatus[keyof typeof orderStatus]

export const paymentMethod = {
    CASH: 'cash',
    TRANSACTION: 'transaction'
} as const

export type OrderPaymentMethod = typeof paymentMethod[keyof typeof paymentMethod]

interface OrderItem {
    productId: Types.ObjectId
    productName: string
    price: number
    cost: number
    quantity: number
    _id: Types.ObjectId
}

export interface IOrder extends Document {
    orderNumber: string
    notes?: string
    total: number
    products: OrderItem[]
    paymentMethod: 'cash' | 'transaction'
    status: 'pending' | 'paid'
    paidAt?: Date
}

const OrderSchema: Schema = new Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PENDING
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(paymentMethod),
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true })

const Order = mongoose.model<IOrder>('Order', OrderSchema)
export default Order