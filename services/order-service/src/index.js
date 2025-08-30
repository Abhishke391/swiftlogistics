import app from "./app.js";
import { config } from "./config/index.js";
import { startPublisher } from "./events/publisher.js";
import logger from './utils/logger.js';

app.listen(config.port, async () => {
    logger.info(`Order service running on port ${config.port}`);
    try {
        await startPublisher();
    } catch (error) {
        logger.error({err: error}, 'Failed to start event publisher');
        process.exit(1);
    }
})