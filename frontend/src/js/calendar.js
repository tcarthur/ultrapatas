/**
 * Ultrapatas Calendar Module
 * Gerencia o calendário de agendamentos
 */

const Calendar = {
  currentDate: new Date(),
  selectedDate: null,
  selectedTime: null,
  availableSlots: [],

  /**
   * Inicializa o calendário
   */
  init() {
    this.renderCalendar();
    this.setupEventListeners();
  },

  /**
   * Renderiza o calendário do mês atual
   */
  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();
    
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    // Update month/year display
    document.getElementById('calendar-month-year').textContent = 
      `${monthNames[month]} ${year}`;

    // Generate calendar days
    const daysContainer = document.getElementById('calendar-days');
    daysContainer.innerHTML = '';

    // Previous month days
    for (let i = firstDayIndex; i > 0; i--) {
      const day = this.createDayElement(
        prevLastDayDate - i + 1,
        'text-gray-300 cursor-not-allowed',
        false
      );
      daysContainer.appendChild(day);
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= lastDayDate; i++) {
      const dayDate = new Date(year, month, i);
      const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isToday = dayDate.toDateString() === today.toDateString();
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
      
      let classes = 'hover:bg-brandBlue hover:text-white transition cursor-pointer';
      let isSelectable = true;

      if (isPast) {
        classes = 'text-gray-300 cursor-not-allowed';
        isSelectable = false;
      } else if (isWeekend) {
        classes = 'text-gray-400 cursor-not-allowed';
        isSelectable = false;
      } else if (isToday) {
        classes += ' border-2 border-brandPink';
      }

      const day = this.createDayElement(i, classes, isSelectable, dayDate);
      daysContainer.appendChild(day);
    }

    // Next month days (to fill grid)
    const totalCells = daysContainer.children.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    
    for (let i = 1; i <= remainingCells; i++) {
      const day = this.createDayElement(i, 'text-gray-300 cursor-not-allowed', false);
      daysContainer.appendChild(day);
    }
  },

  /**
   * Cria elemento de dia do calendário
   */
  createDayElement(dayNumber, classes, isSelectable, date = null) {
    const day = document.createElement('div');
    day.className = `p-3 text-center rounded-lg ${classes}`;
    day.textContent = dayNumber;

    if (isSelectable && date) {
      day.dataset.date = date.toISOString().split('T')[0];
      day.addEventListener('click', () => this.selectDate(date, day));
    }

    return day;
  },

  /**
   * Seleciona uma data
   */
  async selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('#calendar-days > div').forEach(el => {
      el.classList.remove('bg-brandBlue', 'text-white');
    });

    // Highlight selected
    element.classList.add('bg-brandBlue', 'text-white');

    this.selectedDate = date;
    this.selectedTime = null;

    // Fetch available slots
    await this.fetchAvailableSlots(date);
    this.renderTimeSlots();
  },

  /**
   * Busca horários disponíveis para a data
   */
  async fetchAvailableSlots(date) {
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      // TODO: Substituir por chamada real à API quando backend estiver rodando
      // const response = await fetch(`http://localhost:3000/api/appointments/available-slots?date=${dateStr}`);
      // const data = await response.json();
      // this.availableSlots = data.availableSlots;

      // Mock data para desenvolvimento
      this.availableSlots = [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
      ];
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      this.availableSlots = [];
    }
  },

  /**
   * Renderiza os horários disponíveis
   */
  renderTimeSlots() {
    const container = document.getElementById('time-slots');
    container.innerHTML = '';

    if (!this.selectedDate) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Selecione uma data primeiro</p>';
      return;
    }

    if (this.availableSlots.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">Sem horários disponíveis</p>';
      return;
    }

    this.availableSlots.forEach(time => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-brandBlue hover:bg-brandBlue hover:text-white transition';
      slot.textContent = time;
      slot.addEventListener('click', () => this.selectTime(time, slot));
      container.appendChild(slot);
    });
  },

  /**
   * Seleciona um horário
   */
  selectTime(time, element) {
    // Remove previous selection
    document.querySelectorAll('#time-slots button').forEach(el => {
      el.classList.remove('bg-brandBlue', 'text-white', 'border-brandBlue');
      el.classList.add('border-gray-300');
    });

    // Highlight selected
    element.classList.remove('border-gray-300');
    element.classList.add('bg-brandBlue', 'text-white', 'border-brandBlue');

    this.selectedTime = time;

    // Enable confirm button
    document.getElementById('btn-confirm-appointment').disabled = false;
    document.getElementById('btn-confirm-appointment').classList.remove('opacity-50', 'cursor-not-allowed');
  },

  /**
   * Navega para o mês anterior
   */
  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    this.renderCalendar();
  },

  /**
   * Navega para o próximo mês
   */
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    this.renderCalendar();
  },

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    document.getElementById('btn-prev-month')?.addEventListener('click', () => this.previousMonth());
    document.getElementById('btn-next-month')?.addEventListener('click', () => this.nextMonth());
  },

  /**
   * Obtém data e hora selecionadas
   */
  getSelection() {
    return {
      date: this.selectedDate ? this.selectedDate.toISOString().split('T')[0] : null,
      time: this.selectedTime
    };
  },

  /**
   * Reseta seleções
   */
  reset() {
    this.selectedDate = null;
    this.selectedTime = null;
    this.availableSlots = [];
    this.renderCalendar();
    document.getElementById('time-slots').innerHTML = '<p class="text-gray-500 text-center py-4">Selecione uma data primeiro</p>';
  }
};

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calendar;
}
