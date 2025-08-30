import 'dotenv/config';

export const config = {
    port: Number(process.env.PORT || 3000),
    serviceName: process.env.SERVICE_NAME || 'order-service',
    logLevel: process.env.LOG_LEVEL || 'info',
    databaseUrl: process.env.DATABASE_URL,
    rabbitUrl: process.env.RABBITMQ_URL || 'amqp://localhost',
    eventExchange: process.env.EVENT_EXCHANGE || 'events'
}