// Lê os dados do arquivo .env
require('dotenv').config();

// Imports
const express = require('express');
const cors = require('cors');
const DatabaseService = require('./services/database_service');
const BootstrapService = require('./services/bootstrap_service');

DatabaseService.conectar()
.then(() => {
  console.log('Conectado ao banco de dados');
  BootstrapService.boostrap();
})
.catch(erro => {
  console.error('Erro ao conectar ao banco de dados', erro);
});

// Constantes
const PORTA = parseInt(process.env.SERVER_PORT);

// Cria a aplicação express
const app = express();

// Configurar o servidor
app.use(cors()); // permite requisições CORS de qualquer host
app.use(express.json()); // popula req.body

// Adiciono os controllers
app.get('/', (req, res) => res.send('Aplicação de login'));
app.use('/usuarios', require('./controllers/usuario_controller'));
app.use('/login', require('./controllers/login_controller'));

// Dado que o banco de dados está ok, continua a inicialização
app.listen(PORTA, () => {
  console.log(`O servidor está no ar em http://localhost:${PORTA}`);
});

