import { Router } from "express";
import { body, param } from "express-validator";
import { OrderController } from "../controllers/OrderController";
import { handleInputErrors } from "../middleware/validation";
import { orderStatus, paymentMethod } from "../models/Order";

const router = Router()

/** Orders */
router.post('/',
    body('products')
        .isArray({ min: 1 }).withMessage('Debes incluir al menos un producto'),
    body('products.*.product')
        .isMongoId().withMessage('ID de producto no válido'),
    body('products.*.quantity')
        .isInt({ min: 1 }).withMessage('La cantidad debe ser al menos 1'),
    body('products.*.unitPrice')
        .isFloat({ min: 0 }).withMessage('El precio unitario debe ser mayor o igual a 0'),
    body('paymentMethod')
        .notEmpty().withMessage('El método de pago es obligatorio')
        .isIn(Object.values(paymentMethod)).withMessage('Método de pago inválido'),
    body('notes')
        .optional()
        .isString().withMessage('Notas debe ser un texto'),
    handleInputErrors,
    OrderController.createOrder
)

router.get('/', OrderController.getAllOrders)

router.get('/:orderId',
    param('orderId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    OrderController.getOrderById
);

router.put('/:orderId',
    param('orderId')
        .isMongoId().withMessage('ID no válido'),
    body('products')
        .optional()
        .isArray({ min: 1 }).withMessage('Debes incluir al menos un producto'),
    body('products.*.product')
        .optional()
        .isMongoId().withMessage('ID de producto no válido'),
    body('products.*.quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('Cantidad inválida'),
    body('products.*.unitPrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('Precio inválido'),
    body('notes')
        .optional()
        .isString().withMessage('Notas debe ser un texto'),
    body('status')
        .optional()
        .isIn(Object.values(orderStatus))
        .withMessage(`Estado inválido. Debe ser uno de: ${Object.values(orderStatus).join(', ')}`),
    body('paymentMethod')
        .optional()
        .isIn(Object.values(paymentMethod)).withMessage('Método de pago inválido'),
    handleInputErrors,
    OrderController.updateOrder
)

router.delete('/:orderId',
    param('orderId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    OrderController.deleteOrder
)

export default router