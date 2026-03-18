const { google } = require('googleapis');
require('dotenv').config();

/**
 * Google API Configuration
 * Configuração centralizada para todas as APIs do Google
 */

// OAuth2 Client Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials if refresh token exists
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
}

// Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

// Google Calendar API
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Sheet Configuration
const SHEET_CONFIG = {
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
  sheetName: process.env.GOOGLE_SHEET_NAME || 'Agendamentos',
  range: `${process.env.GOOGLE_SHEET_NAME || 'Agendamentos'}!A:H`
};

// Calendar Configuration
const CALENDAR_CONFIG = {
  calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  timeZone: 'America/Sao_Paulo'
};

module.exports = {
  oauth2Client,
  sheets,
  calendar,
  SHEET_CONFIG,
  CALENDAR_CONFIG
};
