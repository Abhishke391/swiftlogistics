import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { orderRouter } from './routes/order.js';
import { metrics, metricsMiddleware } from './utils/metrics.js';
import {prisma} from './config/prisma.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(metricsMiddleware);

//health: db check route
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).json({status: 'ok'});
    } catch (error) {
        return res.status(500).json({status: 'error', message: 'Database connection failed'});
    }
});

//metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metrics.register.contentType);
    res.end(await metrics.register.metrics());
})

//routes
app.use('/orders', orderRouter);

export default app;