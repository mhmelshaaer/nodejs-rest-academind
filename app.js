import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { MongooseConnect } from './database/connection.js';
import { ProductRouter } from './api/routes/products.js'
import { OrderRouter } from './api/routes/order.js';
import { UserRouter } from './api/routes/user.js';

const app = express();

// Connecting to MongoDB
MongooseConnect();

app.use('/uploads', express.static('uploads'));

// Watching server for changes
app.use(morgan('dev'));

// Parsing requests body using body-parser pkg
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, x-Requested-Witj, Content-Type, Accept, Authorization'
    );

    if (req.method === "OPTIONS") {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )

        return res.status(200).json({});
    }

    next();

});


app.use('/product', ProductRouter);
app.use('/order', OrderRouter);
app.use('/user', UserRouter);

// Handling non matched requests
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

export { app };