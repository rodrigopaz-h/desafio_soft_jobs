require('dotenv').config();

const { Pool } = require('pg');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const db = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    allowExitOnIdle: true,
});

//Crea la tabla 'usuarios' en la base de datos si no existe.
const createTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,  -- ID único para cada usuario
            email VARCHAR(50) NOT NULL,  -- Correo electrónico del usuario
            password VARCHAR(60) NOT NULL,  -- Contraseña hasheada del usuario
            rol VARCHAR(25),  -- Rol del usuario (ej. admin, customer)
            lenguage VARCHAR(20)  -- Lenguaje preferido del usuario
        );
    `);
};

//Inicializa la base de datos creando la tabla de usuarios si no existe.
const initDB = async () => {
    console.log('Creando tabla si no existe');
    await createTable();
    console.log('Tabla creada');
};

module.exports = {
    db,
    initDB,
};
