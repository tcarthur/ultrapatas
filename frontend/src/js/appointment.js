/**
 * Ultrapatas Appointment Module
 * Gerencia o modal e formulário de agendamento
 */

const Appointment = {
  modal: null,

  /**
   * Inicializa o módulo
   */
  init() {
    this.modal = document.getElementById('appointment-modal');
    this.setupEventListeners();
  },

  /**
   * Abre o modal de agendamento
   */
  openModal() {
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Inicializa o calendário
    if (typeof Calendar !== 'undefined') {
      Calendar.init();
    }
  },

  /**
   * Fecha o modal
   */
  closeModal() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('appointment-form').reset();
    
    // Reset calendar
    if (typeof Calendar !== 'undefined') {
      Calendar.reset();
    }
    
    // Reset confirm button
    const btnConfirm = document.getElementById('btn-confirm-appointment');
    btnConfirm.disabled = true;
    btnConfirm.classList.add('opacity-50', 'cursor-not-allowed');
  },

  /**
   * Submete o formulário de agendamento
   */
  async submitAppointment(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    
    const selection = Calendar.getSelection();
    
    if (!selection.date || !selection.time) {
      this.showMessage('Por favor, selecione uma data e horário', 'error');
      return;
    }

    const appointmentData = {
      tutorName: formData.get('tutorName'),
      phone: formData.get('phone').replace(/\D/g, ''),
      email: formData.get('email') || '',
      address: formData.get('address'),
      petName: formData.get('petName'),
      examType: formData.get('examType'),
      symptoms: formData.get('symptoms'),
      date: selection.date,
      time: selection.time
    };

    // Disable submit button
    const btnSubmit = document.getElementById('btn-submit-appointment');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Agendando...';

    try {
      // TODO: Substituir por chamada real à API quando backend estiver rodando
      // const response = await fetch('http://localhost:3000/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(appointmentData)
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || 'Erro ao criar agendamento');
      // }

      // Mock success para desenvolvimento
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showSuccessMessage(appointmentData);

    } catch (error) {
      console.error('Erro ao agendar:', error);
      this.showMessage(error.message || 'Erro ao criar agendamento. Tente novamente.', 'error');
      
      // Re-enable submit button
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Confirmar Agendamento';
    }
  },

  /**
   * Atualiza a exibição de data e hora selecionadas
   */
  updateAppointmentDisplay() {
    const selection = Calendar.getSelection();
    
    if (selection.date && selection.time) {
      const [year, month, day] = selection.date.split('-');
      const dateFormatted = `${day}/${month}/${year}`;
      
      document.getElementById('display-selected-date').textContent = dateFormatted;
      document.getElementById('display-selected-time').textContent = selection.time;
    }

    // Atualizar tipo de exame selecionado
    const examType = document.querySelector('input[name="examType"]:checked')?.value || 'Ultrassom Abdominal';
    document.getElementById('display-selected-exam').textContent = examType;
  },

  /**
   * Mostra mensagem de sucesso
   */
  showSuccessMessage(data) {
    const formContainer = document.getElementById('form-container');
    const successContainer = document.getElementById('success-container');
    
    formContainer.classList.add('hidden');
    successContainer.classList.remove('hidden');

    // Formata a data para exibição
    const [year, month, day] = data.date.split('-');
    const dateFormatted = `${day}/${month}/${year}`;

    document.getElementById('success-name').textContent = data.tutorName;
    document.getElementById('success-pet').textContent = data.petName;
    document.getElementById('success-date').textContent = dateFormatted;
    document.getElementById('success-time').textContent = data.time;
    document.getElementById('success-exam').textContent = data.examType;

    // Mensagem via WhatsApp
    const message = encodeURIComponent(
      `Olá! Confirmando meu agendamento:\n\n` +
      `Tutor: ${data.tutorName}\n` +
      `Pet: ${data.petName}\n` +
      `Data: ${dateFormatted}\n` +
      `Horário: ${data.time}\n` +
      `Exame: ${data.examType}\n` +
      `Endereço: ${data.address}\n\n` +
      `Aguardo confirmação!`
    );
    
    const whatsappLink = `https://wa.me/5531973021618?text=${message}`;
    document.getElementById('whatsapp-confirm-link').href = whatsappLink;
  },

  /**
   * Mostra mensagem de erro
   */
  showMessage(message, type = 'info') {
    const messageEl = document.getElementById('form-message');
    messageEl.textContent = message;
    messageEl.className = `p-4 rounded-lg text-center ${
      type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
    }`;
    messageEl.classList.remove('hidden');

    setTimeout(() => {
      messageEl.classList.add('hidden');
    }, 5000);
  },

  /**
   * Valida e formata telefone
   */
  formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length > 6) {
      value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }

    input.value = value;
  },

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Botões de abrir modal
    document.querySelectorAll('[href="#agendamento"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });

    // Botão de fechar modal
    document.getElementById('btn-close-modal')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Fechar ao clicar fora
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Botão de confirmar seleção de data/hora
    document.getElementById('btn-confirm-appointment')?.addEventListener('click', () => {
      document.getElementById('step-calendar').classList.add('hidden');
      document.getElementById('step-form').classList.remove('hidden');
      
      // Exibir data e hora selecionadas
      this.updateAppointmentDisplay();
    });

    // Botão de voltar para calendário
    document.getElementById('btn-back-to-calendar')?.addEventListener('click', () => {
      document.getElementById('step-form').classList.add('hidden');
      document.getElementById('step-calendar').classList.remove('hidden');
    });

    // Submit do formulário
    document.getElementById('appointment-form')?.addEventListener('submit', (e) => {
      this.submitAppointment(e);
    });

    // Formatação de telefone
    document.getElementById('input-phone')?.addEventListener('input', (e) => {
      this.formatPhone(e.target);
    });

    // Atualizar exame quando mudar
    document.querySelectorAll('input[name="examType"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.getElementById('display-selected-exam').textContent = radio.value;
      });
    });

    // Fechar modal de sucesso
    document.getElementById('btn-close-success')?.addEventListener('click', () => {
      this.closeModal();
      // Reset para tela inicial
      document.getElementById('success-container').classList.add('hidden');
      document.getElementById('form-container').classList.remove('hidden');
      document.getElementById('step-form').classList.add('hidden');
      document.getElementById('step-calendar').classList.remove('hidden');
    });
  }
};

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Appointment.init());
} else {
  Appointment.init();
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Appointment;
}
