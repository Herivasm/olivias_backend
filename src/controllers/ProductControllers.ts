import type { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
    static createProduct = async (req: Request, res: Response) => {
        const product = new Product(req.body)

        try {
            await product.save()
            res.send('Producto creado correctamente')

        } catch (error) {
            console.log(error);
        }
    }

    static getAllProducts = async (req: Request, res: Response) => {
        try {
            const products = await Product.find({})
            res.json(products)

        } catch (error) {
            console.log(error);
        }
    }

    static getProductById = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const product = await Product.findById(id)

            if (!product) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            res.json(product)

        } catch (error) {
            console.log(error);
        }
    }

    static updateProduct = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const product = await Product.findById(id)

            if (!product) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            product.productName = req.body.productName
            product.price = req.body.price
            product.description = req.body.description
            product.imageUrl = req.body.imageUrl
            product.category = req.body.category

            await product.save()
            res.send('Producto actualizado')

        } catch (error) {
            console.log(error);
        }
    }

    static deleteProduct = async (req: Request, res: Response) => {
        const { id } = req.params

        try {
            const product = await Product.findById(id)

            if (!product) {
                const error = new Error('Producto no encontrado')
                res.status(404).json({ error: error.message })
                return
            }

            await product.deleteOne()
            res.send('Producto eliminado')

        } catch (error) {
            console.log(error);
        }
    }
}