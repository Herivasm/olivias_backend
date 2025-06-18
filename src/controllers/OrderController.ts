import type { Request, Response } from "express";
import Order from "../models/Order";
import { generateOrderNumber } from "../utils/generateOrderNumber";

export class OrderController {
    static createOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { notes, products, paymentMethod } = req.body

            if (!Array.isArray(products) || products.length === 0) {
                res.status(400).json({ error: 'Debes incluir al menos un producto' })
                return
            }

            if (!paymentMethod || !['cash', 'transaction'].includes(paymentMethod)) {
                res.status(400).json({ error: 'Método de pago inválido' })
                return
            }

            const orderNumber = await generateOrderNumber()

            const total = products.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0)

            const newOrder = new Order({
                orderNumber,
                notes,
                products,
                total,
                paymentMethod
            })

            await newOrder.save()
            res.status(201).json({ message: 'Orden creada', order: newOrder })

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la orden' })
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

    static updateOrder = async (req: Request, res: Response): Promise<void> => {
        const { orderId } = req.params

        try {
            const order = await Order.findById(orderId)

            if (!order) {
                res.status(404).json({ error: 'Orden no encontrada' })
                return
            }

            const { products, notes, status, paymentMethod } = req.body

            if (status) {
                if (!['pending', 'paid'].includes(status)) {
                    res.status(400).json({ error: 'Estado inválido' })
                    return
                }
                order.status = status
            }

            if (paymentMethod) {
                if (!['cash', 'transaction'].includes(paymentMethod)) {
                    res.status(400).json({ error: 'Método de pago inválido' })
                    return
                }
                order.paymentMethod = paymentMethod
            }

            if (products) {
                if (!Array.isArray(products) || products.length === 0) {
                    res.status(400).json({ error: 'Debes incluir al menos un producto' })
                    return
                }

                order.products = products
                order.total = products.reduce((acc: number, item: any) => acc + item.quantity * item.unitPrice, 0)
            }

            if (notes !== undefined) {
                order.notes = notes
            }

            await order.save()
            res.status(200).json({ message: 'Orden actualizada', order })

        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al actualizar la orden' })
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
