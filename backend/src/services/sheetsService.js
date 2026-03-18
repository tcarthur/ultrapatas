const { sheets, SHEET_CONFIG } = require('../config/googleConfig');

/**
 * Google Sheets Service
 * Gerencia todas as operações com Google Sheets
 */

class SheetsService {
  /**
   * Busca todos os agendamentos da planilha
   */
  async getAllAppointments() {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_CONFIG.spreadsheetId,
        range: SHEET_CONFIG.range,
      });

      const rows = response.data.values || [];
      
      if (rows.length === 0) {
        return [];
      }

      // Remove header row
      const [header, ...data] = rows;
      
      return data.map(row => ({
        id: row[0],
        name: row[1],
        phone: row[2],
        email: row[3],
        date: row[4],
        time: row[5],
        status: row[6] || 'pending',
        calendarEventId: row[7] || null
      }));
    } catch (error) {
      console.error('Error fetching appointments from Sheets:', error);
      throw new Error('Failed to fetch appointments from Google Sheets');
    }
  }

  /**
   * Adiciona um novo agendamento na planilha
   */
  async createAppointment(appointmentData) {
    try {
      const { name, phone, email, date, time, calendarEventId } = appointmentData;
      
      // Generate unique ID
      const id = `APT-${Date.now()}`;
      
      const values = [
        [id, name, phone, email, date, time, 'confirmed', calendarEventId || '']
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_CONFIG.spreadsheetId,
        range: SHEET_CONFIG.range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      return {
        id,
        name,
        phone,
        email,
        date,
        time,
        status: 'confirmed',
        calendarEventId
      };
    } catch (error) {
      console.error('Error creating appointment in Sheets:', error);
      throw new Error('Failed to create appointment in Google Sheets');
    }
  }

  /**
   * Busca agendamentos por data
   */
  async getAppointmentsByDate(date) {
    try {
      const allAppointments = await this.getAllAppointments();
      return allAppointments.filter(apt => apt.date === date);
    } catch (error) {
      console.error('Error fetching appointments by date:', error);
      throw error;
    }
  }

  /**
   * Atualiza o status de um agendamento
   */
  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      const allAppointments = await this.getAllAppointments();
      const index = allAppointments.findIndex(apt => apt.id === appointmentId);
      
      if (index === -1) {
        throw new Error('Appointment not found');
      }

      // Row index in sheet (+2 because of header and 0-based index)
      const rowIndex = index + 2;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_CONFIG.spreadsheetId,
        range: `${SHEET_CONFIG.sheetName}!G${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[newStatus]]
        },
      });

      return { success: true, appointmentId, newStatus };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  /**
   * Inicializa a planilha com cabeçalhos se não existir
   */
  async initializeSheet() {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_CONFIG.spreadsheetId,
        range: `${SHEET_CONFIG.sheetName}!A1:H1`,
      });

      // Se não há cabeçalhos, adiciona
      if (!response.data.values || response.data.values.length === 0) {
        const headers = [
          ['ID', 'Nome', 'Telefone', 'Email', 'Data', 'Horário', 'Status', 'Calendar Event ID']
        ];

        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_CONFIG.spreadsheetId,
          range: `${SHEET_CONFIG.sheetName}!A1:H1`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: headers },
        });

        console.log('✅ Sheet initialized with headers');
      }
    } catch (error) {
      console.error('Error initializing sheet:', error);
      throw error;
    }
  }
}

module.exports = new SheetsService();
