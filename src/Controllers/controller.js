const { hashPassword, signToken, verifyToken } = require('../helpers/helpers');
const userModel = require('../models/models');

require('dotenv').config();

//Crea un nuevo usuario en la base de datos.
const createUser = async (req, res) => {
    try {
        // Renombré 'lenguage' (error tipográfico desde el frontend) a 'lenguaje' para mantener consistencia en el backend.
        const { email, password, rol, lenguage: lenguaje } = req.body;

        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const passwordHashed = await hashPassword(password);
        
        const verifyIfUser = await userModel.verifyIfExist(email);
        if (verifyIfUser.exist) {
            return res.status(400).json({ msg: 'Already exists' });
        }

        const response = await userModel.create(email, passwordHashed, rol, lenguaje);
        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

//Inicia sesión y genera un token para el usuario.
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        const passwordMatch = await userModel.checkPassword(email, password);
        if (passwordMatch.match) {
            return res.status(200).json({
                token: signToken({ email, roles: ['admin', 'customer'] }),
            });
        } else {
            return res.status(401).json({ msg: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
};

//Devuelve los datos del usuario autenticado.
const getUserData = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ msg: 'Token is required' });
        }

        const decoded = verifyToken(token);
        const email = decoded.email;

        const userData = await userModel.verifyIfExist(email);
        if (userData.exist) {
            const { password, ...userResponse } = userData.data;
            return res.status(200).json(userResponse);
        } else {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    createUser,
    login,
    getUserData,
};
