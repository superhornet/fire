import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { router as mainRouter } from './routes/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @class App
 *
 */
export class App {
    public express;
    //public database;
    public applicationName = 'Fire';

    /**
     * Sets up the App object attributes,
     * Loads routes and middleware,
     * Initializes the database.
     */
    constructor() {
        this.express = express();
        this.loadRoutes();

        //        this.database = database;
        // Set Pug (Jade) as the view engine
        this.express.set('views', path.join(__dirname, 'views'));
        this.express.set('view engine', 'pug');

        // Serve static files
        this.express.use(express.static(path.join(__dirname, '../public')));
    }

    /**
     * Enable .json() for req.body content.
     * Enable urlencoded() for future use.
     * Set up routes
     */
    public loadRoutes(): void {
        this.express.use(express.json());
        this.express.use(express.urlencoded());
        this.express.use('/', mainRouter);
    }
}

// export default App;
