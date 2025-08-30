import { Router } from "express";
import { createOrder, getOrder, updateOrderStatus } from "../controller/orderController.js";

export const orderRouter = Router();


orderRouter.post('/', createOrder)
orderRouter.get('/:id', getOrder);
orderRouter.put('/:id/status', updateOrderStatus)