const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json()); // Middleware para processar JSON
app.use(express.urlencoded({ extended: true })); // Adicione isto para aceitar FormData

// Configuração do servidor de e-mail
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // ou true para usar SSL
  auth: {
    user: 'seu_email@example.com',
    pass: 'sua-senha'
  }
});

// Função para enviar e-mail
function enviarEmail(respostas) {
  const mailOptions = {
    from: 'seu_email@example.com',
    to: 'destinatario@example.com',
    subject: 'Respostas do questionário',
    text: `Olá! Aqui estão as respostas do questionário:\n\n${JSON.stringify(respostas, null, 2)}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('E-mail enviado com sucesso!');
    }
  });
}

// Rota para receber as respostas do questionário
app.post('/enviar-respostas', (req, res) => {
  const respostas = req.body;
  enviarEmail(respostas);
  res.send('Respostas enviadas com sucesso!');
});

// Inicia o servidor
const porta = 3000;
app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}`);
});