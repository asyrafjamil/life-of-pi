/**
 * Single action controller method
 *
 * @route GET /health
 * @description Health checking endpoint for application.
 * @access public
 *
 * @param {*} req Request object
 * @param {*} res Response object
 */
module.exports = (req, res) => {
    res.status(200).send({
        status: 'success',
        message: 'API is healthy.'
    });
};
