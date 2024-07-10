// Task 0 - Redis Utils: Contains the Class Redis Client

import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Create Client
    this.client = redis.createClient();

    // Message Displayed on Connection
    this.client.on('connect', () => {
      this.isReady = true;
      console.log('Successfully connected to the client! :)');
    });

    // Message Displayed on Error
    this.client.on('error', () => {
      console.log('Could not connect to the client. :(');
    });

    // Return a promise to wait for connection
    this.connectPromise = new Promise((resolve, reject) => {
      this.client.on('ready', () => {resolve()});
      this.client.on('error', () => {reject()});
    })

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
  }

  // Function to test if client is connected
  async isAlive() {
    try {
      await this.connectPromise;
      return true;
    } catch (err) {
      return false;
    }
  }

  // Returns the value of a key
  async get(key) {
    try {
      await this.connectPromise;
      const value = await this.getAsync(key);
      // If value isn't null, return value, else null.
      return value !== null ? value : null;
    } catch (err) {
      console.error('Could not GET value:', err);
      return null;
    }
  };

  // Stores the value by a key
  async set(key, value, time) {
    try {
      await this.connectPromise;
      await this.setAsync(key, value, 'EX', time);
    } catch (err) {
      console.error('Could not SET value:', err);
    }
  };

  // Deletes a value of a key
  async del(key) {
    try {
      await this.connectPromise;
      await this.delAsync(key);
    } catch (err) {
      console.error('Could not delete key', err);
    }
  };
}

const redisClient = new RedisClient();
export default redisClient;
