const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const validationMiddleware = require('../middlewares/validationMiddleware');

/**
 * Appointment Routes
 * Rotas para gerenciamento de agendamentos
 */

// GET /api/appointments/available-slots?date=2024-01-30
router.get(
  '/available-slots',
  [
    query('date')
      .notEmpty()
      .withMessage('Date is required')
      .isDate()
      .withMessage('Invalid date format (use YYYY-MM-DD)')
  ],
  validationMiddleware,
  appointmentController.getAvailableSlots
);

// POST /api/appointments
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters'),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone is required')
      .matches(/^\d{10,11}$/)
      .withMessage('Phone must be 10 or 11 digits'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email format'),
    body('date')
      .notEmpty()
      .withMessage('Date is required')
      .isDate()
      .withMessage('Invalid date format'),
    body('time')
      .notEmpty()
      .withMessage('Time is required')
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Invalid time format (use HH:MM)')
  ],
  validationMiddleware,
  appointmentController.createAppointment
);

// GET /api/appointments
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/:date
router.get('/:date', appointmentController.getAppointmentsByDate);

module.exports = router;
