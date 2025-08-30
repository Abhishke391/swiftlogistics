import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger.js";
export const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'warn' },
    ]
});
  
prisma.$on('error', (e) => logger.error({err: e}, 'Prisma Error'));
prisma.$on('info', (e) => logger.info({msg: e.message}, 'Prisma Info'));
prisma.$on('query', (e) => logger.debug({query: e.query, params: e.params}, 'Prisma Query'));
prisma.$on('warn', (e) => logger.warn({warn: e.message}, 'Prisma Warn'));