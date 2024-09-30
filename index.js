const server = require('./src/server');
const { initDB } = require('./src/db/config');

const { PORT } = process.env;

const startServer = async () => {
    try {
        await initDB();

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize the database:', error);
        process.exit(1);
    }
};

startServer();
