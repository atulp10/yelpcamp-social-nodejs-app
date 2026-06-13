const mongoose = require('mongoose');
const { config, validateProductionConfig } = require('./config/env');
const { createApp } = require('./app');

async function start() {
    validateProductionConfig();
    await mongoose.connect(config.dbUrl);
    console.log('Database connected.');

    const app = createApp();
    const server = app.listen(config.port, () => {
        console.log(`App listening on port ${config.port}.`);
    });

    async function shutdown(signal) {
        console.log(`${signal} received. Shutting down.`);
        server.close(async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch(error => {
    console.error('Application startup failed:', error);
    process.exit(1);
});
