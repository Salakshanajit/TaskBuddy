// Express 4 does not catch rejected promises, so wrap async handlers and forward errors to next().
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
