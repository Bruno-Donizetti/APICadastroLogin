require('dotenv').config();

const jwt = require('jsonwebtoken');

// Variaveis de ambiente
const JWT_KEY = process.env.JWT_KEY;
const URI = process.env.URI;
const DB_NAME = process.env.DB_NAME;

const express = require("express");
const cors = require("cors");

const { MongoClient, ObjectId } = require("mongodb")


// importando middlewares
const cadastrarMiddleware = require('./middlewares/cadastrarMiddleware');
const Usuario = require('./models/Usuario');
const loginMiddlewareFactory = require('./middlewares/loginMiddleware');
const verificarTokenMiddleware = require('./middlewares/verificarTokenMiddleware');
const alterarDadosMiddlewareFactory = require("./middlewares/alterarDadosMiddleware")

// inicializando servidor
const app = express();
app.use(cors());
app.use(express.json());

// mongodb

const client = new MongoClient(URI);

// Conectando ao banco
(async () => {
    try {
        await client.connect();
        console.log("Conectado ao banco.");
    } catch (error) {
        console.log(`Erro ao conectar no banco: ${error}`);
    }
})();

// banco de dados e collection
const db = client.db(DB_NAME);
const collectionUsuarios = db.collection('usuarios');

// Rotas

// Após passar pelo midlleware, faz a inserção dos dados na collection usuarios
app.post("/cadastrar", cadastrarMiddleware, async (req, res) => {
    // carregando o corpo da requisição
    const { usuario, senha, imgPerfil, descricao} = req.body;

    // objeto Usuario para inserir no banco
    const user = await Usuario.criar(usuario, senha, imgPerfil, descricao);

    try {
        // inserindo no banco
        await collectionUsuarios.insertOne(user);
        return res.status(201).json({ mensagem: "Usuario cadastrado." });
    } catch (error) {
        // em caso de erro
        console.log(`Erro ao inserir usuario:`);
        console.log(error);
        
        return res.status(500).json({mensagem: "Erro ao tentar cadastrar usuario."});
    }
});

// gerando o loginMiddleware, passando a collection de usuarios para ele poder ser utilizado da melhor forma
const loginMiddleware = loginMiddlewareFactory(collectionUsuarios);

// após passar pelo loginMiddleware, gera um jwt e retorna ele
app.post("/login", loginMiddleware, async (req, res) => {
    const token = jwt.sign({idUsuario: req.idUsuario}, JWT_KEY, {expiresIn: "1h"});

    return res.status(200).json({
        token: token
    })
})

// após verificar se o token é valido, busca o usuario e retorna ele
// Caso os dados não sejam encontrados, retorna uma mensagem
app.get("/dados", verificarTokenMiddleware, async (req, res) => {
    
    try {
        const idUsuario = new ObjectId(req.id);

        const dados = await collectionUsuarios.findOne({
            _id: idUsuario
        });

        if (!dados) {
            return res.status(404).json({mensagem: "Usuario não encontrado."})
        }
        
        return res.status(200).json({
            usuario: dados.usuario,
            imgPerfil: dados.imgPerfil,
            descricao: dados.descricao
        })
    } catch (error) {
        console.log("Erro na rota /dados:");
        console.log(error);
        
        return res.status(500).json({mensagem: "Erro ao buscar usuario."})
    }
});

// As rotas abaixo de verificação de nome de usuario são apenas auxiliares para o frontend
// não substituem a verificação das rotas

// Verifica se o usuario já existe
app.get("/verificarUsuario/:nomeUsuario", async (req, res) => {
    const nomeUsuario = req.params.nomeUsuario;
    let qtd;

    try {
        qtd = await collectionUsuarios.countDocuments({usuario: nomeUsuario});
    } catch (error) {
        console.log("Erro ao verificar usuario:");
        console.log(error);
        
        return res.status(500).json({mensagem: "Erro ao verificar usuario."})
    }

    if (qtd > 0) {
        return res.status(200).json({ disponivel: false });
    }

    return res.status(200).json({ disponivel: true });
});

// verifica se é possivél alterar o nome do usuario
app.get("/verificarAlterarUsuario/:nomeUsuario", verificarTokenMiddleware, async (req, res) => {
    const nomeUsuario = req.params.nomeUsuario;
    let qtd;
    let dados;

    try {
        qtd = await collectionUsuarios.countDocuments({usuario: nomeUsuario});
        dados = await collectionUsuarios.findOne({_id: new ObjectId(req.id)});
    } catch (error) {
        console.log("Erro ao verificar alteração de usuario:");
        console.log(error);
        
        return res.status(500).json({mensagem: "Erro ao verificar alteração de usuario."})
    }

    if (qtd > 0 && dados.usuario == nomeUsuario) {
        return res.status(200).json({ disponivel: true });
    }

    if (qtd > 0) {
        return res.status(200).json({ disponivel: false });
    }

    return res.status(200).json({ disponivel: true });
});

const alterarDadosMiddleware = alterarDadosMiddlewareFactory(collectionUsuarios);

// após verificar o token e passar pelo middleware alterarDadosMiddleware
// altera os dados
app.put("/alterarDados", [verificarTokenMiddleware, alterarDadosMiddleware], async (req, res) => {
    const {usuario, descricao, imgPerfil} = req.body;

    try {
        await collectionUsuarios.updateOne(
            {_id: new ObjectId(req.id)},
        { $set: {
            usuario: usuario,
            descricao: descricao,
            imgPerfil: imgPerfil
        }});

        return res.status(200).json({mensagem: "Usuario alterado com sucesso."})
    } catch (error) {
        console.log("Erro ao alterar usuario: ");
        console.log(error);
        
        return res.status(500).json({mensagem: "Erro ao alterar usuário."});
    }
    
});

// após o middleware verificarToken, deleta o usuario a partir do id
// caso não delete nenhum usuario, retorna que o usuario não foi encontrado
app.delete("/deletarUsuario", verificarTokenMiddleware, async (req, res) => {
    try {
        const dados = await collectionUsuarios.deleteOne({_id: new ObjectId(req.id)});
        
        if (dados.deletedCount > 0) {
            return res.status(200).json({mensagem: "Usuario deletado."});
        }else{
            return res.status(404).json({mensagem: "Usuario não encontrado."});
        }
        
    } catch (error) {
        console.log("Erro ao deletar:");
        console.log(error);

        return res.status(500).json({mensagem: "Erro ao deletar usuario."});
    }
});

// 

app.listen(3000, () => {
    console.log("CONECTADO");
})