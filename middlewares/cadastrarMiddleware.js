function cadastrarMiddleware(req, res, next) {
    const { usuario, senha, confirmarSenha, imgPerfil, descricao} = req.body;

    if (!usuario || !senha || !confirmarSenha || !imgPerfil  || !descricao) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });
    }

    if (imgPerfil < 0 || imgPerfil > 5) {
        return res.status(400).json({
            mensagem: "Valor inválido para a imagem de perfil."
        });
    }

    if (senha != confirmarSenha) {
        return res.status(400).json({
            mensagem: "As senhas são diferentes."
        });
    }

    next();
}

module.exports = cadastrarMiddleware;