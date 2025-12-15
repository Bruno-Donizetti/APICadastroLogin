const { hashSenha } = require("./Hash");

class Usuario{
    usuario;
    senha;
    imgPerfil; 
    descricao;

    constructor(usuario, senha, imgPerfil, descricao){
        this.usuario = usuario;
        this.imgPerfil = imgPerfil;
        this.descricao = descricao;
        this.senha = senha;
    }

    static async criar(usuario, senha, imgPerfil, descricao){
        senha = await hashSenha(senha);
        return new Usuario(usuario, senha, imgPerfil, descricao);
    }
}

module.exports = Usuario;