import express from 'express';
import routes from './routes/index.js';

// Express App Setup
const app = express();
const port = 5000;

// Tie to Routes Object
routes(app);

app.listen(port);

export default app;
