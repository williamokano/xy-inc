import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

/**
 * Load the correct env file
 */
if (process.env.NODE_ENV === 'prod') {
    dotenv.config({path: `${__dirname}/envs/prod.env`});
} else if (process.env.NODE_ENV === 'test') {
    dotenv.config({path: `${__dirname}/envs/test.env`});
} else {
    dotenv.config({path: `${__dirname}/envs/dev.env`});
}

/**
 * Create express app
 */
const app = express();

/**
 * Setup mongoose
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', err => {
    console.err(err);
    console.log('Could not connect to mongodb, make sure it is running');
    process.exit(1);
});

app.set('db', mongoose);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Setup routes
 */
app.use('/', require('./routes/index'));

/**
 * Handle 404 not found
 */
app.use(function (req, res) {
    res.statusCode = 404;
    res.json({
        error: 'not_found',
        message: 'Page not found'
    });
});

/**
 * Error handler
 */
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    next(err);
});

module.exports = app;
