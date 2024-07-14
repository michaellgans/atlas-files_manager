// Auth Controller
import redisClient from "../utils/redis.js";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';

class AuthController {
  // - Auth Controller Class - 
  // Manages auth caching with Redis Database
  static async getConnect(req, res) {
    try {
      // Authorization header from post request
      const authHeader = req.headers.authorization;

      // Authorization Header is missing: 401
      if (!authHeader) {
        return res.status(401).send({ error: 'Unauthorized.  Please provide an authorization header.' });
      }

      // Isolate User Data
      const [, encodedUserData] = authHeader.split(' ');

      // Converts Base64 to Ascii
      const decodedUserData = Buffer.from(encodedUserData, 'base64').toString('ascii');
      const [userEmail, userPassword] = decodedUserData.split(':');

      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ email: userEmail });

      // If existing user cannot be found: 401
      if (!existingUser) {
        return res.status(401).send({ error: 'Unauthorized.' });
      }
      const hashedPassword = crypto.createHash('sha1').update(userPassword).digest('hex');
      if (existingUser.password !== hashedPassword) {
        return res.status(401).send({ error: 'Unauthorized.' });
      }

      // Generate uuidv4 Token
      const token = uuidv4();
      const fullToken = `auth_${token}`;
      const existingUserId = existingUser._id.toString();
      const timeInSeconds = 24 * 60 * 60

      await redisClient.set(fullToken, existingUserId, timeInSeconds);

      return res.status(200).send({token});

    } catch (err) {
      console.error(err);
    }
  }

  static async getDisconnect(req, res) {
    // Sign out user based on Auth Token
    return
  }
}

export default AuthController;
