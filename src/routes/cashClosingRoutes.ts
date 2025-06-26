import { Router } from 'express';
import { body, param } from 'express-validator';
import { CashClosingController } from '../controllers/CashClosingController';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/',
    body('initialFund')
        .isFloat({ gt: -1 }).withMessage('El fondo inicial debe ser un número positivo.'),
    body('closingDate')
        .isISO8601().withMessage('La fecha de cierre no es válida.'),
    body('notes')
        .optional().isString(),
    handleInputErrors,
    CashClosingController.createCashClosing
);

router.get('/', CashClosingController.getAllClosings);

router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    CashClosingController.getClosingById
);

export default router;