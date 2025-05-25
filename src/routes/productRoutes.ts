import { Router } from "express";
import { body, param } from "express-validator";
import { ProductController } from "../controllers/ProductControllers";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/',
    body('productName')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .notEmpty().withMessage('El precio del producto no puede ir vacío'),
    body('description')
        .notEmpty().withMessage('La descripción del producto no puede ir vacía'),
    handleInputErrors,
    ProductController.createProduct)

router.get('/', ProductController.getAllProducts)

router.get('/:id',
    param('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors, ProductController.getProductById)

router.put('/:id',
    body('productName')
        .notEmpty().withMessage('El nombre del producto no puede ir vacío'),
    body('price')
        .notEmpty().withMessage('El precio del producto no puede ir vacío'),
    body('description')
        .notEmpty().withMessage('La descripción del producto no puede ir vacía'),
    handleInputErrors,
    ProductController.updateProduct
)

router.delete('/:id',
    param('id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors, ProductController.deleteProduct
)
export default router