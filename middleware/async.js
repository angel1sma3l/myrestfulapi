//try and catch function.
module.exports = function asyncMiddleware(handler) {
    return async (req, res) => {
        try {
            await handler (req, res);
        } catch(ex) {
            next(ex);
        }
    };
}