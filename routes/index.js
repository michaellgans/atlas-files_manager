// Defined Routes
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';

// Routes Object
const routes = (app) => {
  // Status GET route controller
  app.get('/status', AppController.getStatus);

  // Stats GET route controller
  app.get('/stats', AppController.getStats);

  // Users POST route controller
  // app.post('/users', UsersController.postNew);
};

export default routes;
