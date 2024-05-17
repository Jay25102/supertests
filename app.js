const express = require("express");
const morgan = require("morgan");
const itemRouter = require("./itemRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use("/items", itemRouter);

app.use(function(req, res, next) {
    return new ExpressError("Not Found", 404);
});

// global error handler
app.use(function(err, req, res, next) {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;