import type { Request, Response } from "express";
import Order from "../models/Order";
import Product from "../models/Product";
import { generateOrderNumber } from "../utils/generateOrderNumber";
import { IOrder } from "../models/Order";

export class OrderController {

    static createOrder = async (req: Request, res: Response): Promise<void> => {
        try {
            const { notes, products, paymentMethod } = req.body;

            const productIds = products.map((p: { product: string }) => p.product);
            const dbProducts = await Product.find({ _id: { $in: productIds } });

            if (dbProducts.length !== productIds.length) {
                res.status(404).json({ error: 'Uno o más productos no fueron encontrados' });
                return;
            }

            let calculatedTotal = 0;
            const orderProducts = products.map((item: { product: string; quantity: number }) => {
                const productFromDB = dbProducts.find(p => p._id.toString() === item.product);
                const unitPrice = productFromDB!.price;
                calculatedTotal += unitPrice * item.quantity;
                return {
                    product: productFromDB!._id,
                    quantity: item.quantity,
                    unitPrice: unitPrice
                };
            });

            const orderNumber = await generateOrderNumber();

            const newOrder = new Order({
                orderNumber,
                notes,
                products: orderProducts,
                total: calculatedTotal,
                paymentMethod
            });

            await newOrder.save();
            const populatedOrder = await newOrder.populate('products.product');

            res.status(201).json({ message: 'Orden creada exitosamente', order: populatedOrder });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la orden' });
        }
    }

    static getAllOrders = async (_req: Request, res: Response): Promise<void> => {
        try {
            const orders = await Order.find().populate('products.product');
            res.json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }

    static getOrderById = async (req: Request, res: Response): Promise<void> => {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId).populate('products.product');
            if (!order) {
                res.status(404).json({ error: 'Orden no encontrada' });
                return;
            }
            res.json(order);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la orden' });
        }
    }

    static updateOrder = async (req: Request, res: Response): Promise<void> => {
        const { orderId } = req.params;
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                res.status(404).json({ error: 'Orden no encontrada' });
                return;
            }

            const { products, notes, status, paymentMethod } = req.body;

            if (status !== undefined) {
                if (order.status === 'pending' && status === 'paid') {
                    order.paidAt = new Date();
                }
                order.status = status;
            }
            if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
            if (notes !== undefined) order.notes = notes;

            if (products) {
                const productIds = products.map((p: { product: string }) => p.product);
                const dbProducts = await Product.find({ _id: { $in: productIds } });

                if (dbProducts.length !== productIds.length) {
                    res.status(404).json({ error: 'Al actualizar, uno o más productos no fueron encontrados' });
                    return;
                }

                let calculatedTotal = 0;
                const updatedOrderProducts = products.map((item: { product: string; quantity: number }) => {
                    const productFromDB = dbProducts.find(p => p._id.toString() === item.product);
                    const unitPrice = productFromDB!.price;
                    calculatedTotal += unitPrice * item.quantity;
                    return { product: productFromDB!._id, quantity: item.quantity, unitPrice };
                });

                order.products = updatedOrderProducts as IOrder['products'];
                order.total = calculatedTotal;
            }

            await order.save();
            const populatedOrder = await order.populate('products.product');

            res.status(200).json({ message: 'Orden actualizada', order: populatedOrder });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la orden' });
        }
    }

    static deleteOrder = async (req: Request, res: Response): Promise<void> => {
        const { orderId } = req.params;
        try {
            const order = await Order.findByIdAndDelete(orderId);
            if (!order) {
                res.status(404).json({ error: 'Orden no encontrada' });
                return;
            }
            res.json({ message: 'Orden eliminada correctamente' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la orden' });
        }
    }

    static getSalesByDate = async (req: Request, res: Response) => {
        const date = req.query.date as string;

        try {
            const startOfDay = new Date(`${date}T00:00:00.000Z`);
            const endOfDay = new Date(`${date}T23:59:59.999Z`);

            const filter = {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: 'paid'
            };

            const ordersOfTheDay = await Order.find(filter).populate('products.product');

            const totalSales = ordersOfTheDay.reduce((sum, order) => sum + order.total, 0);
            const cashSales = ordersOfTheDay
                .filter(order => order.paymentMethod === 'cash')
                .reduce((sum, order) => sum + order.total, 0);
            const transactionSales = totalSales - cashSales;

            const response = {
                summary: { totalSales, cashSales, transactionSales, orderCount: ordersOfTheDay.length },
                orders: ordersOfTheDay
            };

            res.json(response);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el reporte de ventas' });
        }
    }
}