import {logger} from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
    logger.error({err}, 'Unhandled Error');
    res.status(500).json({ message: 'Internal Server Error' });
}