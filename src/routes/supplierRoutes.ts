import { Router } from "express";
import { body, param } from "express-validator";
import { SupplierController } from "../controllers/SupplierController";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

/** Suppliers */
router.post('/',
    body('supplierName')
        .notEmpty().withMessage('El nombre del proveedor no puede ir vacío'),
    body('contact')
        .notEmpty().withMessage('El contacto del proveedor no puede ir vacío'),
    handleInputErrors,
    SupplierController.createSupplier
)

router.get('/', SupplierController.getAllSuppliers)

router.get('/:supplierId',
    param('supplierId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SupplierController.getSupplierById
)

router.put('/:supplierId',
    body('supplierName')
        .notEmpty().withMessage('El nombre del proveedor no puede ir vacío'),
    body('contact')
        .notEmpty().withMessage('El contacto del proveedor no puede ir vacío'),
    handleInputErrors,
    SupplierController.updateSupplier
)

router.delete('/:supplierId',
    param('supplierId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    SupplierController.deleteSupplier
)

export default router