import amqp from 'amqplib';
import {prisma} from '../config/prisma.js';
import { config } from '../config/index.js';
import {metrics} from '../utils/metrics.js';
import logger from '../utils/logger.js';

let channel;

export async function startPublisher() {
    const con = await amqp.connect(config.rabbitUrl);
    channel = await con.createChannel();
    await channel.assertExchange(config.eventExchange, 'topic', {durable: true});
    logger.info('RabbitMQ connected for event publishing');
    
    setInterval(async () => {
        try {
            const batch = await prisma.outbox.findMany({
                where: {published: false},
                orderBy: {id: 'asc'},
                take: 20
            })

            for (const row of batch) {
                const routingKey = `order.${row.eventType}`;
                const payload = Buffer.from(JSON.stringify(row.payload));
                await channel.publish(config.eventExchange, routingKey, payload, {persistent: true});

                await prisma.outbox.update({
                    where: {id: row.id},
                    data: {published: true, publishedAt: new Date()}
                });

                metrics.counters.outboxPublished.inc();
                logger.info({eventType: row.eventType, aggregateId: row.aggregateId}, 'Event published to exchange')
            }
        } catch (error) {
            logger.error({err: error}, 'Failed to publish events from outbox');
        }
    }, 1000);
}