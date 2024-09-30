require('dotenv').config();
const { hash, compare } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

//Función para hashear una contraseña.
const hashPassword = async (password) => {
    try {
        return await hash(password, 8);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Failed to hash password');
    }
};

//Función para verificar una contraseña contra un hash.
const verifyPassword = async (password, hashedPassword) => {
    try {
        return await compare(password, hashedPassword);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw new Error('Failed to verify password');
    }
};

// Función para firmar un token JWT.
const signToken = (data) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return sign(data, String(JWT_SECRET), { expiresIn: '30m' });
};

//Función para verificar un token JWT.
const verifyToken = (token) => {
    try {
        return verify(token, String(JWT_SECRET));
    } catch (error) {
        console.error('Invalid token:', error);
        throw new Error('Invalid token');
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
    signToken,
    verifyToken,
};
