import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { placeholderRoutes } from '@@routes/index.js';

function initializeApp(): Application {
    const app = express();

    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.set("trust proxy", true);
    app.set("trust proxy", "loopback");

    /* Routes */
    app.use("/placeholder", placeholderRoutes);

    return app;
};

export default initializeApp;