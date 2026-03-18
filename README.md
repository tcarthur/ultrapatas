# Ultrapatas - Sistema de Agendamento Veterinário

Sistema completo de landing page com agendamento integrado para clínica veterinária especializada em ultrassonografia.

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5
- TailwindCSS (via CDN)
- JavaScript Vanilla

### Backend
- Node.js
- Express.js
- Google Sheets API (banco de dados)
- Google Calendar API (sincronização de agenda)
- Express Validator (validação)

## 📁 Estrutura do Projeto

```
ultrapatas/
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── ultrapatas.png
│   │   └── index.html
│   └── src/
│       ├── js/
│       │   └── main.js
│       └── css/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── googleConfig.js
│   │   │   └── businessConfig.js
│   │   ├── controllers/
│   │   │   └── appointmentController.js
│   │   ├── routes/
│   │   │   └── appointmentRoutes.js
│   │   ├── services/
│   │   │   ├── sheetsService.js
│   │   │   └── calendarService.js
│   │   ├── middlewares/
│   │   │   └── validationMiddleware.js
│   │   └── utils/
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔧 Instalação

### 1. Clone o repositório
```bash
cd ultrapatas
```

### 2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
- Google API credentials (Client ID, Secret, Refresh Token)
- Google Sheet ID
- Google Calendar ID
- Twilio credentials (para WhatsApp)

### 3. Instale as dependências do backend
```bash
cd backend
npm install
```

### 4. Configure o Google Cloud Project

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as APIs:
   - Google Sheets API
   - Google Calendar API
4. Crie credenciais OAuth 2.0
5. Baixe o arquivo `credentials.json` e coloque na pasta `backend/`

### 5. Gere o Refresh Token

Execute o script de autenticação:
```bash
cd backend
node src/utils/generateToken.js
```

## 🚀 Execução

### Desenvolvimento

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
Use um servidor local como Live Server (VS Code) ou:
```bash
cd frontend/public
npx http-server -p 5500
```

### Produção

```bash
cd backend
npm start
```

## 📋 API Endpoints

### Listar slots disponíveis
```http
GET /api/appointments/available-slots?date=2024-01-30
```

### Criar agendamento
```http
POST /api/appointments
Content-Type: application/json

{
  "name": "João Silva",
  "phone": "31973021618",
  "email": "joao@example.com",
  "date": "2024-01-30",
  "time": "14:00"
}
```

### Listar todos os agendamentos
```http
GET /api/appointments
```

### Listar agendamentos por data
```http
GET /api/appointments/2024-01-30
```

## 🗓️ Configuração de Horários

Edite `backend/src/config/businessConfig.js` para configurar:
- Dias de funcionamento
- Horário de abertura/fechamento
- Duração dos exames
- Horário de almoço

## 📱 Funcionalidades

- ✅ Landing page responsiva e otimizada para SEO
- ✅ Calendário de agendamento interativo
- ✅ Sincronização com Google Calendar
- ✅ Armazenamento em Google Sheets
- ✅ Validação de horários disponíveis
- ✅ Notificações por email (via Google Calendar)
- 🔄 Notificações via WhatsApp (em desenvolvimento)

## 🔐 Segurança

- Helmet.js para headers de segurança
- CORS configurado
- Validação de dados com express-validator
- Variáveis de ambiente para credenciais sensíveis

## 📞 Contato

**Ultrapatas**  
Telefone: (31) 97302-1618  
Email: contato@ultrapatas.com.br

---

Desenvolvido com ❤️ por Arthur
