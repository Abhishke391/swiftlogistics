import { orderSchema } from "../validations/orderSchema.js";
import {prisma} from '../config/prisma.js';
import { metrics } from '../utils/metrics.js'
import logger from '../utils/logger.js';
import { randomUUID } from "crypto";

export const createOrder = async (req, res) => {
    const { error } = orderSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: 'Validation failed',
            details: error.details.map((d) => d.message)
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    clientId: req.body.clientId,
                    pickupAddress: req.body.pickupAddress,
                    deliveryAddress: req.body.deliveryAddress,
                    packageDetails: req.body.packageDetails
                }
            })
            const eventPayload = {
                eventId: randomUUID(),
                eventType: 'OrderCreated',
                orderId: order.id,
                clientId: order.clientId,
                payload: {
                    pickupAddress: req.body.pickupAddress,
                    deliveryAddress: req.body.deliveryAddress,
                    packageDetails: req.body.packageDetails
                },
                occuredAt: new Date().toISOString()
            }

            await tx.outbox.create({
                data: {
                    aggregateId: order.id,
                    eventType: 'OrderCreated',
                    payload: eventPayload
                }
            })
            return order;
        })
        metrics.counters.orderCreated.inc();
        logger.info({orderId: result.id, clientId: result.clientId}, 'order created successfully');
        return res.status(200).json({orderId: result.id, status: result.status})
    } catch (error) {
        metrics.counters.orderCreateFailed.inc();
        logger.error({error}, 'Failed to create order');
        return res.status(500).json({message: 'Failed to create order'});
    }
}

//get the order details by id
export const getOrder = async (req, res) => {
    const order = await prisma.order.findUnique({
        where: {id: req.params.id}
    });
    if (!order) return res.status(404).json({message: 'Order not found'});
    return res.status(200).json(order);
}

//update the order status
export const updateOrderStatus = async (req, res) => {
    const allowed = ['Pending', 'In_Transit', 'Delivered', 'Cancelled'];
    const {status} = req.body;
    if (!allowed.includes(status)) return res.status(400).json({message: 'Invalid status'});
    
    try {
        const updated = await prisma.order.update({
            where: {id: req.params.id},
            data: {status}
        })
        await prisma.outbox.create({
            data: {
                aggregateId: updated.id,
                eventType: 'OrderUpdated',
                payload: {
                    eventType: 'OrderUpdated',
                    orderId: updated.id,
                    status: updated.status,
                    occuredAt: new Date().toISOString()
                }
            }
        });
        logger.info({orderId: updated.id, status: updated.status}, 'Order status updated');
        return res.status(200).json({orderId: updated.id, status: updated.status});
    } catch (error) {
        logger.error({error}, 'Failed to update order status');
        return res.status(500).json({message: 'Failed to update order status'});
    }
}