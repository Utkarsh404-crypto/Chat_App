const notFound = (req, res, next) => {

    const error = new Error(`${req.originalUrl} not found`);
    res.status(400);
    next(error);
}

const errors = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 200 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.satck,
    })
}

module.exports = { notFound, errors }