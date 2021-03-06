const Usuario = require('../models/usuario');
const Seguranca = require('../services/seguranca_service');

const criar_usuario_administrador = async () => {
  Usuario.count({}, async (err, count) => {
    // Se ainda não há usuários cadastrados
    if (count === 0) {
      // Encripta a senha
      const senha = await Seguranca.encripta(process.env.SENHA_ADMIN);

      // Criar o administrador
      await new Usuario({
        email: process.env.EMAIL_ADMIN,
        senha: senha,
        validado: true,
        roles: ['admin', 'user']
      }).save();

      console.log('Usuário administrador criado com sucesso');
    }
  });
};

const boostrap = () => {
  criar_usuario_administrador();
};

module.exports = {
  boostrap
};