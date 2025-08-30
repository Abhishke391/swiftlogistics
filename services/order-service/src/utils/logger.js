import pino from 'pino';
import { config } from '../config/index.js';

const logger = pino({
    level: config.logLevel,
    base: { service: config.serviceName },
    timestamp: pino.stdTimeFunctions.isoTime,
})

export default logger;