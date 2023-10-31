const path = require('path');
const { Worker } = require('worker_threads');

const redisClient = require('../../config/redis');

/**
 * Controller method to calculate Pi.
 * @route POST /pi
 * @description Endpoint to calculate the value of Pi.
 * @access public
 * @param {*} req - The HTTP request object.
 * @param {*} res - The HTTP response object.
 */

let currentPrecision = -1;

const calculatePi = (req, res) => {
    currentPrecision += 1;
    const workerPath = path.join(__dirname, '..', 'workers', 'piWorker.js');
    const piWorker = new Worker(workerPath);

    piWorker.postMessage({ type: 'calculatePi', digits: currentPrecision });

    piWorker.once('message', async (message) => {
        if (message.type === 'result') {
            await redisClient.set('pi', message.result);
            res.status(200).send({
                status: 'success',
                pi: message.result
            });
        } else {
            console.error('Unexpected message type from worker:', message.type);
            res.status(500).send({
                status: 'error',
                message: 'An unexpected error occurred'
            });
        }
        piWorker.terminate(); // Terminate the worker once the job is done
    });

    piWorker.on('error', (error) => {
        console.error('Worker error:', error);
        res.status(500).send({
            status: 'error',
            message: 'An error occurred while calculating Pi'
        });
        piWorker.terminate(); // Ensure to terminate the worker in case of an error
    });

    piWorker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
};

/**
 * Controller method to get Pi.
 * @route GET /pi
 * @description Endpoint to get the value of Pi.
 * @access public
 * @param {*} req - The HTTP request object.
 * @param {*} res - The HTTP response object.
 */
const getPi = async (req, res) => {
    res.status(200).send({
        status: 'success',
        pi: await redisClient.get('pi') || '3'
    });
};

module.exports = {
    calculatePi,
    getPi
};
