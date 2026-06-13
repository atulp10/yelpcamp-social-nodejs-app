const crypto = require('crypto');
const ExpressError = require('./ExpressError');

function createToken(req, res, next) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
}

function protect(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

    const submitted = req.body?._csrf || req.query?._csrf || req.get('x-csrf-token');
    const expected = req.session.csrfToken;

    if (!submitted || !expected) {
        return next(new ExpressError('Invalid or missing security token. Please refresh and try again.', 403));
    }

    const submittedBuffer = Buffer.from(String(submitted));
    const expectedBuffer = Buffer.from(String(expected));
    if (submittedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(submittedBuffer, expectedBuffer)) {
        return next(new ExpressError('Invalid or missing security token. Please refresh and try again.', 403));
    }

    next();
}

module.exports = { createToken, protect };
