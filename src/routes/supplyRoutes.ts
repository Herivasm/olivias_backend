import { Router } from "express";
import { body, param } from "express-validator";
import { SupplyController } from "../controllers/SupplyController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

/** Supplies */
router.post('/',
    body('supplyName')
        .notEmpty().withMessage('El nombre del insumo no puede ir vacío'),
    body('measure')
        .notEmpty().withMessage('La unidad de medida no puede ir vacía'),
    body('stock')
        .isNumeric().withMessage('El stock debe ser un número'),
    body('supplier')
        .isMongoId().withMessage('ID del proveedor no válido'),
    handleInputErrors,
    SupplyController.createSupply
)

router.get('/', SupplyController.getAllSupplies)

router.get('/:supplyId',
    param('supplyId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SupplyController.getSupplyById
)

router.put('/:supplyId',
    param('supplyId')
        .isMongoId().withMessage('ID no válido'),
    body('supplyName')
        .notEmpty().withMessage('El nombre del insumo no puede ir vacío'),
    body('measure')
        .notEmpty().withMessage('La unidad de medida no puede ir vacía'),
    body('stock')
        .isNumeric().withMessage('El stock debe ser un número'),
    body('suppliers')
        .isArray({ min: 1 }).withMessage('Debe haber al menos un proveedor'),
    body('suppliers.*')
        .isMongoId().withMessage('ID de proveedor no válido en la lista'),
    handleInputErrors,
    SupplyController.updateSupply
)

router.delete('/:supplyId',
    param('supplyId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SupplyController.deleteSupply
)

export default router