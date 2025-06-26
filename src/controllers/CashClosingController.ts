import type { Request, Response } from "express";
import CashClosing from "../models/CashClosing";
import Order from "../models/Order";

export class CashClosingController {

    static createCashClosing = async (req: Request, res: Response): Promise<void> => {
        const { initialFund, notes, closingDate } = req.body;

        try {
            // --- CORRECCIÓN DE ZONA HORARIA Y VALIDACIÓN DE DUPLICADOS ---
            const dateObj = new Date(closingDate);
            const startOfDayForCheck = new Date(dateObj.setHours(0, 0, 0, 0));
            const endOfDayForCheck = new Date(dateObj.setHours(23, 59, 59, 999));

            const existingClosing = await CashClosing.findOne({
                closingDate: { $gte: startOfDayForCheck, $lte: endOfDayForCheck }
            });

            if (existingClosing) {
                res.status(409).json({ error: 'Ya existe un corte de caja para esta fecha.' });
                return;
            }

            // --- CORRECCIÓN DE ZONA HORARIA PARA LA BÚSQUEDA ---
            const startOfDay = new Date(`${closingDate}T00:00:00.000Z`);
            const endOfDay = new Date(`${closingDate}T23:59:59.999Z`);

            const ordersOfTheDay = await Order.find({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                // status: 'paid' // Descomentar cuando implementes el cambio de estado
            });

            const totalSales = ordersOfTheDay.reduce((sum, order) => sum + order.total, 0);
            const cashSales = ordersOfTheDay
                .filter(order => order.paymentMethod === 'cash')
                .reduce((sum, order) => sum + order.total, 0);
            const transactionSales = totalSales - cashSales;
            const expectedCashInBox = initialFund + cashSales;
            const finalBalance = totalSales;

            const cashClosing = new CashClosing({
                closingDate: startOfDay, // Guardamos la fecha normalizada para consistencia
                initialFund,
                notes,
                totalSales,
                cashSales,
                transactionSales,
                totalExpenses: 0,
                expectedCashInBox,
                finalBalance
            });

            await cashClosing.save();
            res.status(201).json({ message: 'Corte de caja registrado exitosamente', cashClosing });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al registrar el corte de caja' });
        }
    }

    static getAllClosings = async (_req: Request, res: Response): Promise<void> => {
        try {
            const closings = await CashClosing.find().sort({ closingDate: -1 });
            res.json(closings);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los cortes de caja' });
        }
    }

    static getClosingById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const closing = await CashClosing.findById(id);
            if (!closing) {
                res.status(404).json({ error: 'Corte de caja no encontrado' });
                return;
            }
            res.json(closing);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el corte de caja' });
        }
    }
}