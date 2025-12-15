const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

async function verificarTokenMiddleware(req, res, next) {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({mensagem: "Sem token na requisição."})
    }

    token = await token.split(" ")[1];

    try {
         const jwtDecode = jwt.verify(token, JWT_KEY);
         req.id = jwtDecode.idUsuario;
    } catch (error) {
        return res.status(401).json({mensagem: "Token inválido."})
    }

    next();
}

module.exports = verificarTokenMiddleware;