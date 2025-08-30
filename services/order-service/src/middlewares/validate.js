export const validate = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (error) {
        return res.status(400).json({
            message: 'Validation Error',
            details: error.details?.map((d) => d.message) || [error.message]
        })
    }
}