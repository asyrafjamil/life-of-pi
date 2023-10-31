const path = require('path');

const healthCheckController = require('../src/controllers/healthCheckController');
const { calculatePi, getPi } = require('../src/controllers/piController');

module.exports = (_, express) => {
    const router = new express.Router({ strict: true });

    router.get('/', (req, res)=> {
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });

    router.get('/health', healthCheckController);

    router.get('/pi', getPi);

    router.post('/pi', calculatePi);

    return router;
};
