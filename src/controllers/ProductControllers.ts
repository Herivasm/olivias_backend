import { Request, Response } from "express";
import Product from "../models/Product";

export class ProductController {
    static createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { productName, price, cost, description, category, photoUrl } = req.body

            const product = new Product({
                productName,
                price,
                cost,
                description,
                category,
                photoUrl,
            })

            await product.save()

            res.status(201).json({ message: "Producto creado", product: product })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error al crear el producto" })
        }
    }

    static getAllProducts = async (_req: Request, res: Response): Promise<void> => {
        try {
            const products = await Product.find()
            res.json(products)

        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error al obtener los productos" })
        }
    }

    static getProductById = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params
        try {
            const product = await Product.findById(productId)
            if (!product) {
                res.status(404).json({ error: "Producto no encontrado" })
                return
            }
            res.json(product)

        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error al obtener el producto" })
        }
    }

    static updateProduct = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params
        try {
            const product = await Product.findById(productId)
            if (!product) {
                res.status(404).json({ error: "Producto no encontrado" })
                return
            }

            const { productName, price, cost, description, category, photoUrl } = req.body

            if (productName !== undefined) product.productName = productName
            if (price !== undefined) product.price = price
            if (cost !== undefined) product.cost = cost
            if (description !== undefined) product.description = description
            if (category !== undefined) product.category = category
            if (photoUrl !== undefined) product.photoUrl = photoUrl

            await product.save()
            res.json({ message: "Producto actualizado", product })

        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error al actualizar el producto" })
        }
    }

    static deleteProduct = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params
        try {
            const product = await Product.findById(productId)
            if (!product) {
                res.status(404).json({ error: "Producto no encontrado" })
                return
            }

            await product.deleteOne()
            res.json({ message: "Producto eliminado" })

        } catch (error) {
            console.error(error)
            res.status(500).json({ error: "Error al eliminar el producto" })
        }
    }
}
