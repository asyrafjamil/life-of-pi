const publicRoutes = require('./publicRoutes');

module.exports = (app, express) => {
    app.use('/', publicRoutes(app, express));
};
