// App Controller
import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
  // App Controllers

  // Controller Method that checks if Redis/DB are active
  static async getStatus(req, res) {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();

    // Return correct response based on db status
    if (redisStatus && dbStatus) {
      res.status(200).send({ "redis": true, "db": true });
    } else if (!redisStatus && dbStatus) {
      res.status(503).send('Redis Not Connected');
    } else if (redisStatus && !dbStatus) {
      res.status(503).send('Database Not Connected');
    } else {
      res.status(503).send('Unknown Database Error');
    }
  }

  // Controller Method that retrieves num of users and files
  static async getStats(req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();

    res.status(200).send({ "users": users, "files": files })
  }
}

export default AppController;
