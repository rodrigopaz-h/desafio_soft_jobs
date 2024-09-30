const { db } = require('../db/config');
const bcrypt = require('bcrypt');
const format = require('pg-format');
const { verifyPassword } = require('../helpers/helpers');

// Función para crear un nuevo usuario en la base de datos
const create = async (email, hashedPassword, rol, lenguaje) => {
    try {
        console.log("Datos a insertar:", { email, hashedPassword, rol, lenguaje });

        const SQLrequest = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *";
        const SQLValues = [email, hashedPassword, rol, lenguaje];

        const { rows: [newUser] } = await db.query(SQLrequest, SQLValues);

        return {
            msg: 'Register success',
            data: newUser
        };

    } catch (error) {
        throw error;
    }
};

// Función para verificar si la contraseña proporcionada coincide con la almacenada
const checkPassword = async (email, password) => {
    try {
        const userExist = await verifyIfExist(email);
        if (userExist.exist) {
            const hashedPassword = userExist.data.password;

            const match = verifyPassword(password, hashedPassword);
            return {
                msg: match ? 'Password verified' : 'Password doesn\'t match',
                match,
            };
        } else {
            return {
                msg: 'User doesn\'t exist',
                match: false,
            };
        }
        
    } catch (error) {
        throw error;
    }
};

// Función para verificar si un usuario existe en la base de datos
const verifyIfExist = async (email) => {
    try {
        const SQLrequest = "SELECT * FROM usuarios WHERE email = $1";
        const SQLValues = [email];

        const { rows: [user] } = await db.query(SQLrequest, SQLValues);

        return user ? { exist: true, data: user } : { exist: false, data: {} };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    create,
    verifyIfExist,
    checkPassword,
    verifyPassword
};
