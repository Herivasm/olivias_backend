import type { Request, Response } from "express";
import Supply from "../models/Supply";
import { Types } from "mongoose";

export class SupplyController {
    static createSupply = async (req: Request, res: Response) => {
        try {
            const { supplyName, stock, supplier } = req.body;

            const existingSupply = await Supply.findOne({ 
                supplyName: { $regex: new RegExp(`^${supplyName}$`, 'i') } 
            });

            if (existingSupply) {
                existingSupply.stock += Number(stock);
                
                const supplierId = new Types.ObjectId(supplier);
                if (!existingSupply.suppliers.includes(supplierId)) {
                    existingSupply.suppliers.push(supplierId);
                }

                await existingSupply.save();
                res.send('Stock de insumo actualizado y proveedor registrado');
            } else {
                const supply = new Supply(req.body);
                supply.suppliers = [new Types.ObjectId(supplier)];
                await supply.save();
                res.send('Insumo nuevo registrado');
            }

        } catch (error) {
            console.log(error);
            res.status(500).send('Error en el servidor');
        }
    }

    static getAllSupplies = async (req: Request, res: Response) => {
        try {
            const supplies = await Supply.find({}).populate('suppliers');
            res.json(supplies);

        } catch (error) {
            console.log(error);
        }
    }

    static getSupplyById = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId).populate('suppliers');

            if (!supply) {
                const error = new Error('Insumo no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            res.json(supply);

        } catch (error) {
            console.log(error);
        }
    }

    static updateSupply = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId);

            if (!supply) {
                const error = new Error('Insumo no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            supply.supplyName = req.body.supplyName;
            supply.measure = req.body.measure;
            supply.stock = req.body.stock;
            supply.suppliers = req.body.suppliers.map((id: string) => new Types.ObjectId(id))

            await supply.save();
            res.send('Insumo actualizado');

        } catch (error) {
            console.log(error);
        }
    }

    static deleteSupply = async (req: Request, res: Response) => {
        const { supplyId } = req.params

        try {
            const supply = await Supply.findById(supplyId);

            if (!supply) {
                const error = new Error('Insumo no encontrado');
                res.status(404).json({ error: error.message });
                return;
            }

            await supply.deleteOne();
            res.send('Insumo eliminado');

        } catch (error) {
            console.log(error);
        }
    }
}