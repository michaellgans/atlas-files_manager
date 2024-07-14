// Auth Controller
import redisClient from "../utils/redis.js";
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  // - Auth Controller Class - 
  // Manages auth caching with Redis Database
  static async getConnect(req, res) {
    // Sign in user and generate Auth Token
    return
  }

  static async getDisconnect(req, res) {
    // Sign out user based on Auth Token
    return
  }
}

export default AuthController;
