// Defined Routes
import AppController from '../controllers/AppController.js';

const routes = (app) => {
  app.get('/status', AppController.getStatus);

  app.get('/stats', AppController.getStats);
};

export default routes;
