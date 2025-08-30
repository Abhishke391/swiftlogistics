import Joi from 'joi';

export const orderSchema = Joi.object({
    clientId: Joi.string().required(),
    pickupAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
    }).required(),
    deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
    }).required(),
    packageDetails: Joi.object({
        weightKg: Joi.number().required(),
        dimensionsCm: Joi.object({
            length: Joi.number().positive().optional(),
            width: Joi.number().positive().optional(),
            height: Joi.number().positive().optional(),
        }).optional(),
    }).required()
});