const { ObjectId } = require('mongodb');

module.exports = (collectionUsuarios) => {
    
    return async (req, res, next) => {
        const {usuario, descricao, imgPerfil} = req.body;

        if (!usuario || !descricao || imgPerfil == null) {
            return res.status(400).json({mensagem: "Preencha todos os campos."});
        }

        if (imgPerfil < 0 || imgPerfil > 5) {
            return res.status(400).json({mensagem: "Escolha uma imagem válida."})
        }

        // se o nome enviado na req já existir e for diferente do nome do usuario, para

        try {
            const qtd = await collectionUsuarios.countDocuments({usuario: usuario});
            const dados = await collectionUsuarios.findOne({_id: new ObjectId(req.id)});
            
            if (qtd > 0 && usuario != dados.usuario) {
                return res.status(400).json({mensagem: "Já existe um usuario com esse nome, tente outro."});
            }
            

        } catch (error) {
            console.log("Erro ao verificar se o usuario existe:");
            console.log(error);
        }

        next();
    }
}