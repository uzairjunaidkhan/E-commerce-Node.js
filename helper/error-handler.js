function errorHandler(err, req, res, next) {

    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ Message: err });
    }

    if (err.name === "ValidationError") {
        return res.status(401).json({ Message: err });
    }

    // return res.status(500).json({ Message: err });
    return res.status(500).json({ error: 'Internal Server Error.. ' + err });
}

module.exports = errorHandler;
