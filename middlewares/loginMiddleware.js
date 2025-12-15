const { ObjectId } = require('mongodb');
const { verificarSenha } = require('../models/Hash.js');

module.exports = (collectionUsuarios) => {
    return async (req, res, next) => {
        const { usuario, senha} = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        const dados = await collectionUsuarios.findOne({
            usuario: usuario
        });

        if (!dados) {
            return res.status(401).json({
                mensagem: "Usuario ou senha inválidos."
            });
        }

        const verify = await verificarSenha( dados.senha, senha);

        if (!verify) {
            return res.status(401).json({
                mensagem: "Usuario ou senha inválidos."
            });            
        }
        
        req.idUsuario = "" + new ObjectId(dados._id);

        next();
    }
};