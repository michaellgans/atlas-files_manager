// Defined Routes for Controllers
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';

// Routes Object
const routes = (app) => {
  // status GET app controller
  app.get('/status', AppController.getStatus);

  // stats GET app controller
  app.get('/stats', AppController.getStats);

  // connect GET auth controller
  app.get('/connect', AuthController.getConnect);

  // disconnect GET auth controller
  app.get('/disconnect', AuthController.getDisconnect);

  // users/me GET users controller
  app.get('/users/me', UsersController.getMe);

  // users POST users controller
  app.post('/users', UsersController.postNew);

  // files POST files controller
  app.post('/files', FilesController.postUpload);

  // files GET files controller passing id parameter
  app.get('/files/:id', FilesController.getShow);

  // files GET files controller
  app.get('/files', FilesController.getIndex);
};

// Export 
export default routes;
