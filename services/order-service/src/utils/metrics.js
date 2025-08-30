import client, { register } from 'prom-client';

const registery = new client.Registry();
client.collectDefaultMetrics({ register: registery });

export const metrics = {
    register: registery,
    counters: {
        orderCreated: new client.Counter({
            name: 'order_created_total',
            help: 'Total number of orders created',
        }),
        orderCreateFailed: new client.Counter({
            name: 'order_create_failed_total',
            help: 'Total number of orders failed to create',
        }),
        outboxPublished: new client.Counter({
            name: 'outbox_published_total',
            help: 'Total number of outbox events published',
        })
    },
    histograms: {
        httpDurationMs: new client.Histogram({
            name: 'http_request_duration_ms',
            help: 'HTTP request duration in ms',
            buckets: [25, 50, 100, 250, 500, 1000, 2000]
        })
    }
}

Object.values(metrics.counters).forEach((m) => metrics.register.registerMetric(m));
Object.values(metrics.histograms).forEach((m) => metrics.register.registerMetric(m));

export function metricsMiddleware(req, res, next) {
    const end = metrics.histograms.httpDurationMs.startTimer();
    res.on('finish', () => end());
    next();
}