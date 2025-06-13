import type { Request, Response } from "express";
import Order from "../models/Order";
import { generateOrderNumber } from "../utils/generateOrderNumber";

export class OrderController {
    static createOrder = async (req: Request, res: Response) => {
        try {
            const { notes, products } = req.body

            if (!Array.isArray(products) || products.length === 0) {
                res.status(400).json({ error: 'Debes incluir al menos un producto' })
                return
            }

            const orderNumber = await generateOrderNumber()

            const total = products.reduce((acc: number, item: any) => {
                return acc + item.quantity * item.unitPrice
            }, 0)

            const newOrder = new Order({
                orderNumber,
                notes,
                products,
                total,
            })

            await newOrder.save()
            res.send('Orden creada')

        } catch (error) {
            console.log(error);
        }
    }

    static getAllOrders = async (req: Request, res: Response) => {
        try {
            const orders = await Order.find().populate('products.product')
            res.json(orders)
        } catch (error) {
            console.log(error);
        }
    }

    static getOrderById = async (req: Request, res: Response) => {
        const { orderId } = req.params

        try {
            const order = await Order.findById(orderId).populate('products.product')

            if (!order) {
                const error = new Error('Orden no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(order)

        } catch (error) {
            console.log(error);
        }
    }

    static updateOrder = async (req: Request, res: Response) => {
        const { orderId } = req.params

        try {
            const order = await Order.findById(orderId)

            if (!order) {
                const error = new Error('Orden no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            const { products, notes, status } = req.body

            if (status && (status === 'pending' || status === 'paid')) {
                order.status = status
            }

            if (products) {
                if (!Array.isArray(products) || products.length === 0) {
                    res.status(400).json({ error: 'Debes incluir al menos un producto' })
                    return
                }

                order.products = products
                order.total = products.reduce((acc: number, item: any) => {
                    acc + item.quantity * item.unitPrice
                    return
                }, 0)
            }

            if (notes !== undefined) {
                order.notes = notes
            }

            if (status) {
                order.status = status
            }

            await order.save()
            res.send('Orden actualizada')

        } catch (error) {
            console.log(error);
        }
    }

    static deleteOrder = async (req: Request, res: Response) => {
        const { orderId } = req.params

        try {
            const order = await Order.findById(orderId)

            if (!order) {
                const error = new Error('Orden no encontrada')
                res.status(404).json({ error: error.message })
                return
            }

            await order.deleteOne()
            res.send('Orden cancelada')

        } catch (error) {
            console.log(error);
        }
    }
}
