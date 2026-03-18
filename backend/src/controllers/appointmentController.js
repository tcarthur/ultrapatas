const sheetsService = require('../services/sheetsService');
const calendarService = require('../services/calendarService');
const { generateTimeSlots, BUSINESS_HOURS } = require('../config/businessConfig');

/**
 * Appointment Controller
 * Controlador de agendamentos
 */

class AppointmentController {
  /**
   * GET /api/appointments/available-slots
   * Retorna os horários disponíveis para uma data específica
   */
  async getAvailableSlots(req, res, next) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
      }

      // Verifica se é um dia útil
      const selectedDate = new Date(date + 'T00:00:00');
      const dayOfWeek = selectedDate.getDay();

      if (!BUSINESS_HOURS.workingDays.includes(dayOfWeek)) {
        return res.json({
          date,
          availableSlots: [],
          message: 'Não atendemos neste dia da semana'
        });
      }

      // Gera todos os slots possíveis
      const allSlots = generateTimeSlots();

      // Busca agendamentos existentes para esta data
      const existingAppointments = await sheetsService.getAppointmentsByDate(date);
      const bookedTimes = existingAppointments.map(apt => apt.time);

      // Filtra slots disponíveis
      const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

      res.json({
        date,
        availableSlots,
        bookedSlots: bookedTimes,
        totalSlots: allSlots.length,
        availableCount: availableSlots.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/appointments
   * Cria um novo agendamento
   */
  async createAppointment(req, res, next) {
    try {
      const { name, phone, email, date, time } = req.body;

      // Validação básica
      if (!name || !phone || !date || !time) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, phone, date, time' 
        });
      }

      // Verifica se o horário está disponível
      const existingAppointments = await sheetsService.getAppointmentsByDate(date);
      const isTimeBooked = existingAppointments.some(apt => apt.time === time);

      if (isTimeBooked) {
        return res.status(409).json({ 
          error: 'Este horário já está reservado. Por favor, escolha outro.' 
        });
      }

      // Cria evento no Google Calendar
      const calendarEvent = await calendarService.createEvent({
        name,
        email,
        phone,
        date,
        time
      });

      // Salva no Google Sheets
      const appointment = await sheetsService.createAppointment({
        name,
        phone,
        email: email || '',
        date,
        time,
        calendarEventId: calendarEvent.eventId
      });

      res.status(201).json({
        success: true,
        message: 'Agendamento realizado com sucesso!',
        appointment: {
          ...appointment,
          calendarLink: calendarEvent.eventLink
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/appointments
   * Lista todos os agendamentos
   */
  async getAllAppointments(req, res, next) {
    try {
      const appointments = await sheetsService.getAllAppointments();
      res.json({
        success: true,
        count: appointments.length,
        appointments
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/appointments/:date
   * Lista agendamentos de uma data específica
   */
  async getAppointmentsByDate(req, res, next) {
    try {
      const { date } = req.params;
      const appointments = await sheetsService.getAppointmentsByDate(date);
      
      res.json({
        success: true,
        date,
        count: appointments.length,
        appointments
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AppointmentController();
