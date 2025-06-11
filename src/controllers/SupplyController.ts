import type { Request, Response } from "express";
import Supply from "../models/Supply";

export class SupplyController {
    static createSupply = async (req: Request, res: Response) => {
        const supply = new Supply(req.body)

        try {
            await supply.save()
            res.send('Insumo registrado')

        } catch (error) {
            console.log(error);
        }
    }

    static getAllSupplies = async (req: Request, res: Response) => {
        try {
            const supplies = await Supply.find({}).populate('supplier')
            res.json(supplies)

        } catch (error) {
            console.log(error);
        }
    }

    static getSupplyById = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId)

            if (!supply) {
                const error = new Error('Insumo no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(supply)

        } catch (error) {
            console.log(error);
        }
    }

    static updateSupply = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId)

            if (!supply) {
                const error = new Error('Insumo no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            supply.supplyName = req.body.supplyName
            supply.measure = req.body.measure
            supply.stock = req.body.stock
            supply.supplier = req.body.supplier

            await supply.save()
            res.send('Insumo actualizado')

        } catch (error) {
            console.log(error);
        }
    }

    static deleteSupply = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId)

            if (!supply) {
                const error = new Error('Insumo no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            await supply.deleteOne()
            res.send('Insumo eliminado')

        } catch (error) {
            console.log(error);
        }
    }
}