const { calendar, CALENDAR_CONFIG } = require('../config/googleConfig');

/**
 * Google Calendar Service
 * Gerencia todas as operações com Google Calendar
 */

class CalendarService {
  /**
   * Cria um evento no Google Calendar
   */
  async createEvent(appointmentData) {
    try {
      const { name, email, phone, date, time } = appointmentData;
      
      // Parse date and time
      const [year, month, day] = date.split('-');
      const [hours, minutes] = time.split(':');
      
      // Create start datetime
      const startDateTime = new Date(year, month - 1, day, hours, minutes);
      
      // End time (30 minutes later)
      const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

      const event = {
        summary: `Ultrassom Abdominal - ${name}`,
        description: `
Cliente: ${name}
Telefone: ${phone}
Email: ${email}
Tipo de Exame: Ultrassom Abdominal
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: CALENDAR_CONFIG.timeZone,
        },
        attendees: email ? [{ email }] : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 60 }, // 1 hour before
          ],
        },
        colorId: '9', // Blue color
      };

      const response = await calendar.events.insert({
        calendarId: CALENDAR_CONFIG.calendarId,
        resource: event,
        sendUpdates: 'all', // Send email notifications
      });

      return {
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
      };
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw new Error('Failed to create event in Google Calendar');
    }
  }

  /**
   * Lista eventos de uma data específica
   */
  async getEventsByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await calendar.events.list({
        calendarId: CALENDAR_CONFIG.calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  /**
   * Cancela um evento do calendário
   */
  async cancelEvent(eventId) {
    try {
      await calendar.events.delete({
        calendarId: CALENDAR_CONFIG.calendarId,
        eventId: eventId,
        sendUpdates: 'all',
      });

      return { success: true, eventId };
    } catch (error) {
      console.error('Error canceling calendar event:', error);
      throw error;
    }
  }

  /**
   * Atualiza um evento do calendário
   */
  async updateEvent(eventId, updates) {
    try {
      const response = await calendar.events.patch({
        calendarId: CALENDAR_CONFIG.calendarId,
        eventId: eventId,
        resource: updates,
        sendUpdates: 'all',
      });

      return response.data;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }
  }
}

module.exports = new CalendarService();
