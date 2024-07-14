// Auth Controller
import redisClient from "../utils/redis.js";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import { SHA1 } from "crypto-js";

  // Client sends user's credentials encoded in Base64
  // Server decodes credentials and verifies against stored
  // Encoded string starts with "Basic:"
  // Password and Email and split
  // Password is SHA1 hashed and checked against stored

class AuthController {
  // - Auth Controller Class - 
  // Manages auth caching with Redis Database
  static async getConnect(req, res) {
    try {
      // Authorization header from post request
      const authHeader = req.headers.authorization;

      // Authorization Header is missing: 401
      if (!authHeader) {
        return res.status(401).send({ error: 'Unathorized.  Please provide an authorization header.' });
      }

      // Isolate User Data
      const [, encodedUserData] = authHeader.split(' ');

      // Converts Base64 to Ascii
      const decodedUserData = Buffer.from(encodedUserData, 'base64').toString('ascii');
      const [userEmail, userPassword] = decodedUserData.split(':');

      const userDocs = await dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ email: userEmail });

      // If existing user cannot be found: 401
      if (!existingUser) {
        return res.status(401).send({ error: 'Unathorized.' });
      }
      const hashedPassword = crypto.createHash('sha1').update(userPassword).digest('hex');
      if (existingUser.userPassword !== hashedPassword) {
        return res.status(401).send({ error: 'Unathorized.' });
      }

      // Generate uuidv4 Token
      const token = uuidv4();
      

    } catch (err) {
      console.log(error);
    }
  }

  static async getDisconnect(req, res) {
    // Sign out user based on Auth Token
    return
  }
}

export default AuthController;
