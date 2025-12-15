const argon2id = require("argon2");

async function hashSenha(senha) {
try {
    let senhaHash = await argon2id.hash(senha);
    return senhaHash;
} catch (error) {
    console.log("Erro ao hashear senha: " + error);
    return null;
}};

async function verificarSenha(senhaHash, senha) {
    try{
        let verify = await argon2id.verify(senhaHash, senha);
        return verify;
    }catch(error){
        console.log("Erro ao verificar senha: " + error);
        return false;
    }
}

module.exports = {
    hashSenha,
    verificarSenha
}