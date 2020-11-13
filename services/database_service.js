const mongoose = require('mongoose');

// Conexão com o banco de dados
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;

const conectar = (params => {
  const {onError, onOpen} = params || {};

  db.on('error', (error) => {
    onError ? onError(error) : console.error(error);
  });

  db.once('open', () => {
    onOpen ? onOpen() : console.log('Conectado ao banco de dados !');
  });
});

module.exports = {
  conectar
};
