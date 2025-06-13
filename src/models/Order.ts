import mongoose, { Document, PopulatedDoc, Schema, Types } from "mongoose";
import { IProduct } from "./Product";

const orderStatus = {
    PENDING: 'pending',
    PAID: 'paid',
} as const

export type OrderStatus = typeof orderStatus[keyof typeof orderStatus]

const paymentMethod = {
    CASH: 'cash',
    TRANSACTION: 'transaction'
} as const

export type OrderPaymentMethod = typeof paymentMethod[keyof typeof paymentMethod]

interface OrderItem {
    product: PopulatedDoc<IProduct>
    quantity: number
    unitPrice: number
}

export interface IOrder extends Document {
    orderNumber: string
    notes?: string
    total: number
    products: OrderItem[],
    paymentMethod: OrderPaymentMethod,
    status: OrderStatus
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
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unitPrice: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    status: {
        type: String,
        enum: Object.values(orderStatus),
        default: orderStatus.PENDING
    },
    paymentMethod: {
        type: String,
        enum: Object.values(paymentMethod),
    }
}, { timestamps: true })

const Order = mongoose.model<IOrder>('Order', OrderSchema)
export default Order
