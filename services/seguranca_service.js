const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const VALIDADE_TOKEN = 300; // 5 minutos (300 segundos)
const BCRYPT_SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

const encripta = async (texto) => {
  return await bcrypt.hash(texto, BCRYPT_SALT_ROUNDS);
};

const compara = async (texto, textoEncriptado) => {
  return bcrypt.compare(texto, textoEncriptado);
};

const criaToken = (usuario) => {
  let payload = {
    id: usuario._id,
    email: usuario.email
  };

  let token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: VALIDADE_TOKEN
  });

  return token;
};

const validaLogin = async (usuario, senha) => {
  if (!usuario) {
    throw 'Não foi encontrado um usuário com o email informado!';
  } else if (await compara(senha, usuario.senha)) {
    if (!usuario.validado) {
      throw 'Sua conta ainda não foi validada. Verifique sua caixa de e-mail.';
    }
  } else {
    throw 'Senha inválida!';
  }
};

/* 
 * Função de middleware que deve ser chamada antes das requisições a backends
 * que só possam ser acessados por usuários autenticados.
 */
const isAutenticado = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (!token) {
    return res.status(401).send({ 
      auth: false, 
      message: 'Não foi encontrado o token no cabeçalho da requisição.'
    });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ 
        auth: false, 
        message: 'Token inválido.' 
      });
    }
    
    Usuario.findById(decoded.id, (err, usuario) => {
      req.usuario = usuario;
      next();
    });
  });
};

module.exports = {
  encripta,
  compara,
  criaToken,
  isAutenticado,
  validaLogin
};