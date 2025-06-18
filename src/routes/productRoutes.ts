import { Router } from "express";
import { body, param } from "express-validator";
import { ProductController } from "../controllers/ProductControllers";
import { handleInputErrors } from "../middleware/validation";
import { productCategories } from "../models/Product";

const router = Router()

router.post('/',
    body('productName')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .notEmpty().withMessage('El precio no puede ir vacío')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    body('cost')
        .notEmpty().withMessage('El costo no puede ir vacío')
        .isFloat({ gt: 0 }).withMessage('El costo debe ser un número mayor a 0'),
    body('description')
        .notEmpty().withMessage('La descripción del producto no puede ir vacía'),
    body('photoUrl')
        .isURL().withMessage('La URL de la foto no es válida'),
    body('category')
        .notEmpty().withMessage('La categoría es obligatoria')
        .isIn(Object.values(productCategories))
        .withMessage('Categoría no válida'),
    handleInputErrors,
    ProductController.createProduct)

router.get('/', ProductController.getAllProducts)

router.get('/:productId',
    param('productId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors, ProductController.getProductById)

router.put('/:productId',
    body('productName')
        .optional()
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0')
        .notEmpty().withMessage('El precio del producto no puede ir vacío'),
    body('cost')
        .optional()
        .notEmpty().withMessage('El costo no puede ir vacío')
        .isFloat({ gt: 0 }).withMessage('El costo debe ser un número mayor a 0'),
    body('description')
        .optional()
        .notEmpty().withMessage('La descripción del producto no puede ir vacía'),
    body('photoUrl')
        .optional()
        .isURL().withMessage('La URL de la foto no es válida'),
    body('category')
        .optional()
        .notEmpty().withMessage('La categoría es obligatoria')
        .isIn(Object.values(productCategories))
        .withMessage('Categoría no válida'),
    handleInputErrors,
    ProductController.updateProduct
)

router.delete('/:productId',
    param('productId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors, ProductController.deleteProduct
)
export default router
