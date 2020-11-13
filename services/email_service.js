const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
  	user: process.env.EMAIL_USER,
  	pass: process.env.EMAIL_PASSWORD
  },
  tls: { 
    rejectUnauthorized: false 
  }
});

const enviar = ({para, assunto, html, texto, attachments}, callback) => {
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: para,
    subject: assunto,
    text: texto,
    html
  };

  if (attachments) {
    mailOptions.attachments = attachments;
  }
  
  transporter.sendMail(mailOptions, (error, info) => {
    callback && callback(error, info);
  });
};

module.exports = {
  enviar
};
