import ampq from "amqplib";
import logger from "../utils/logger.js";
import {prisma} from './prisma.js'

let channel;

export const connectRabbitMQ = async () => {
    try {
        const conn = await ampq.connect(process.env.RABBITMQ_URL);
        channel = await conn.createChannel();
        await channel.assertExchange(process.env.EVENT_EXCHANGE, "fanout", {
            durable: true
        });
        logger.info("Connected to RabbitMQ in tracking service");

        const q = await channel.assertQueue("", {exclusive: true});
        await channel.bindQueue(q.queue, process.env.EVENT_EXCHANGE, "");

        channel.consume(q.queue, async (msg) => {
            if (msg !== null) {
                const event = JSON.parse(msg.content.toString());
                logger.info({event}, "Event received in tracking service");

                if (event.eventType === "OrderCreated") {
                    await prisma.tracking.create({
                        data: {
                            orderId: event.orderId,
                            driverId: "UNASSIGNED",
                            location: {lat: 0, lng: 0},
                            status: "PENDING"
                        }
                    })
                }
                if (event.eventType === "OrderUpdated") {
                    await prisma.tracking.updateMany({
                        where: {orderId: event.orderId},
                        data: {status: event.status}
                    })
                }
                channel.ack(msg);
            }
        })
    } catch (error) {
        logger.error({error}, "Failed to connect to RabbitMQ in tracking service");
    }
}
