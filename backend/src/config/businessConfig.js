/**
 * Business Hours Configuration
 * Configuração de horários de funcionamento da clínica
 */

const BUSINESS_HOURS = {
  // Dias da semana (0 = Domingo, 6 = Sábado)
  workingDays: [1, 2, 3, 4, 5], // Segunda a Sexta
  
  // Horários de atendimento
  startTime: '08:00',
  endTime: '18:00',
  
  // Duração padrão do exame (em minutos)
  appointmentDuration: 30,
  
  // Intervalo entre consultas (em minutos)
  interval: 30,
  
  // Horários de almoço (opcional)
  lunchBreak: {
    start: '12:00',
    end: '13:00'
  }
};

/**
 * Gera os slots de horário disponíveis para um dia
 * @returns {Array} Array de horários no formato 'HH:MM'
 */
function generateTimeSlots() {
  const slots = [];
  const [startHour, startMinute] = BUSINESS_HOURS.startTime.split(':').map(Number);
  const [endHour, endMinute] = BUSINESS_HOURS.endTime.split(':').map(Number);
  const [lunchStartHour, lunchStartMinute] = BUSINESS_HOURS.lunchBreak.start.split(':').map(Number);
  const [lunchEndHour, lunchEndMinute] = BUSINESS_HOURS.lunchBreak.end.split(':').map(Number);
  
  let currentTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;
  const lunchStart = lunchStartHour * 60 + lunchStartMinute;
  const lunchEnd = lunchEndHour * 60 + lunchEndMinute;
  
  while (currentTime < endTime) {
    // Pula horário de almoço
    if (currentTime >= lunchStart && currentTime < lunchEnd) {
      currentTime = lunchEnd;
      continue;
    }
    
    const hour = Math.floor(currentTime / 60);
    const minute = currentTime % 60;
    const timeSlot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    slots.push(timeSlot);
    
    currentTime += BUSINESS_HOURS.interval;
  }
  
  return slots;
}

module.exports = {
  BUSINESS_HOURS,
  generateTimeSlots
};
