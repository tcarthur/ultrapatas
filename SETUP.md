/**
 * Ultrapatas - Instruções de Setup
 */

# PRÓXIMOS PASSOS PARA ATIVAR O SISTEMA

## 1. INSTALAR NODE.JS✅

Baixe e instale o Node.js (versão 18 ou superior):
https://nodejs.org/

Após instalar, reinicie o terminal e execute:
```bash
node --version
npm --version
```

## 2. INSTALAR DEPENDÊNCIAS DO BACKEND✅

```bash
cd backend
npm install
```

## 3. CONFIGURAR GOOGLE APIS✅

### 3.1 Criar Projeto no Google Cloud Console✅

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto (ex: "Ultrapatas")
3. No menu lateral, vá em "APIs e Serviços" > "Biblioteca"
4. Ative as seguintes APIs:
   - Google Sheets API
   - Google Calendar API

### 3.2 Criar Credenciais OAuth 2.0✅

1. Vá em "APIs e Serviços" > "Credenciais"
2. Clique em "Criar Credenciais" > "ID do cliente OAuth"
3. Escolha "Aplicativo da Web"
4. Configure:
   - Nome: Ultrapatas Backend
   - URIs de redirecionamento autorizados:
     * http://localhost:3000/oauth2callback
5. Baixe o arquivo JSON com as credenciais

### 3.3 Criar Google Sheet✅

1. Acesse: https://sheets.google.com/
2. Crie uma nova planilha chamada "Ultrapatas - Agendamentos"
3. Na primeira linha adicione os cabeçalhos:
   | A | B | C | D | E | F | G | H |
   |---|---|---|---|---|---|---|---|
   | ID | Nome | Telefone | Email | Data | Horário | Status | Calendar Event ID |
4. Copie o ID da planilha da URL:
   https://docs.google.com/spreadsheets/d/SEU_SHEET_ID_AQUI/edit
5. Compartilhe a planilha com o email de serviço do projeto Google

### 3.4 Criar Google Calendar

1. Acesse: https://calendar.google.com/
2. Crie um novo calendário chamado "Ultrapatas - Agendamentos"
3. Vá em Configurações > Configurações do calendário
4. Copie o "ID do calendário"
5. Compartilhe com o email de serviço do projeto Google

## 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
# Server
PORT=3000
NODE_ENV=development

# Google API
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_REFRESH_TOKEN=será_gerado_no_próximo_passo

# Google Sheets
GOOGLE_SHEET_ID=seu_sheet_id_aqui
GOOGLE_SHEET_NAME=Agendamentos

# Google Calendar
GOOGLE_CALENDAR_ID=seu_calendar_id_aqui

# Business
BUSINESS_PHONE=5531973021618
BUSINESS_NAME=Ultrapatas
BUSINESS_EMAIL=contato@ultrapatas.com.br

# Frontend
FRONTEND_URL=http://localhost:5500
```

## 5. GERAR REFRESH TOKEN

Crie o arquivo `backend/src/utils/generateToken.js`:

```javascript
const { google } = require('googleapis');
const readline = require('readline');
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Acesse esta URL para autorizar:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Cole o código de autorização aqui: ', async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log('\nRefresh Token:', tokens.refresh_token);
  console.log('\nAdicione este token no arquivo .env como GOOGLE_REFRESH_TOKEN');
  rl.close();
});
```

Execute:
```bash
node src/utils/generateToken.js
```

Copie o Refresh Token gerado para o arquivo `.env`

## 6. INICIAR OS SERVIDORES

### Backend:
```bash
cd backend
npm run dev
```

### Frontend:
Abra `frontend/public/index.html` com Live Server (VS Code)
ou execute:
```bash
npx http-server frontend/public -p 5500
```

## 7. TESTAR O SISTEMA

1. Acesse: http://localhost:5500
2. Clique em "Agendar Exame"
3. Selecione uma data e horário
4. Preencha o formulário
5. Confirme o agendamento
6. Verifique se apareceu:
   - Na planilha Google Sheets
   - No Google Calendar

## 8. PRÓXIMAS FUNCIONALIDADES (OPCIONAL)

### 8.1 WhatsApp Notifications (Twilio)

1. Crie conta em: https://www.twilio.com/
2. Configure WhatsApp Business API
3. Adicione credenciais no `.env`:
   ```env
   TWILIO_ACCOUNT_SID=seu_account_sid
   TWILIO_AUTH_TOKEN=seu_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

### 8.2 Deploy (Produção)

**Backend:**
- Vercel: https://vercel.com/
- Railway: https://railway.app/
- Render: https://render.com/

**Frontend:**
- Netlify: https://www.netlify.com/
- Vercel: https://vercel.com/
- GitHub Pages

## TROUBLESHOOTING

### Erro: "npm: command not found"
→ Instale o Node.js e reinicie o terminal

### Erro: "Google API authentication failed"
→ Verifique se o Refresh Token está correto no .env

### Erro: "Permission denied on Google Sheets"
→ Compartilhe a planilha com o email de serviço do projeto

### Erro: "CORS blocked"
→ Verifique se FRONTEND_URL está correto no .env

---

📧 Dúvidas? Entre em contato!
