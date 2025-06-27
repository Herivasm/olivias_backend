import type { Request, Response } from "express";
import Supplier from "../models/Supplier";
import Supply from "../models/Supply";

export class SupplierController {
    static createSupplier = async (req: Request, res: Response) => {
        const supplier = new Supplier(req.body)

        try {
            await supplier.save()
            res.send('Proveedor registrado')

        } catch (error) {
            console.log(error);
        }
    }

    static getAllSuppliers = async (req: Request, res: Response) => {
        try {
            const suppliers = await Supplier.find({})
            res.json(suppliers)

        } catch (error) {
            console.log(error);
        }
    }

    static getSupplierById = async (req: Request, res: Response) => {
        const { supplierId } = req.params

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                const error = new Error('Proveedor no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            const supplies = await Supply.find({ supplier: supplierId })

            const supplierWithSupplies = {
                ...supplier.toObject(),
                supplies: supplies
            }

            res.json(supplierWithSupplies)

        } catch (error) {
            console.log(error);
        }
    }

    static updateSupplier = async (req: Request, res: Response) => {
        const { supplierId } = req.params

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                const error = new Error('Proveedor no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            supplier.supplierName = req.body.supplierName
            supplier.contact = req.body.contact

            await supplier.save()
            res.send('Proveedor actualizado')

        } catch (error) {
            console.log(error);
        }
    }

    static deleteSupplier = async (req: Request, res: Response) => {
        const { supplierId } = req.params

        try {
            const supplier = await Supplier.findById(supplierId)

            if (!supplier) {
                const error = new Error('Proveedor no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            await supplier.deleteOne()
            res.send('Proveedor eliminado')

        } catch (error) {
            console.log(error);
        }
    }
}