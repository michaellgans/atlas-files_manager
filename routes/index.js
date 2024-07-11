// Defined Routes
import AppController from '../controllers/AppController.js';

// Routes Object
const routes = (app) => {
  // Status route controller
  app.get('/status', AppController.getStatus);

  // Stats route controller
  app.get('/stats', AppController.getStats);
};

export default routes;
