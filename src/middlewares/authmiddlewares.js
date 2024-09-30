require('dotenv').config();
const { verify } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

//Middleware para autenticar el token JWT.
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: 'No se proporcionó un token o es incorrecto' });
        }

        const token = authHeader.split(' ')[1];

        const decoded = verify(token, String(JWT_SECRET));

        req.token = decoded;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token inválido' });
        }
        res.status(500).json({ msg: error.message });
    }
};

module.exports = authMiddleware;
