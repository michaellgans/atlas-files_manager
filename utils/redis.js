// Task 0 - Redis Utils: Contains the Class Redis Client

import redis from 'redis';

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
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error('Could not GET value:', err);
    }
  };

  // Stores the value by a key
  // TODO: look into mode for duration type
  async set(key, value, time) {
    try {
      await this.client.set(key, value, time);
      console.log(`Key: ${key}\nValue: ${value}\nTime: ${time}`)
    } catch (err) {
      console.error('Could not SET value:', err);
    }
  };

  // Deletes a value of a key
  async del(key) {
    try {
      await this.client.del(key);
      console.log(`Key ${key} has been deleted.`)
    } catch (err) {
      console.error('Could not delete key', err);
    }
  };
}

const redisClient = new RedisClient();
export default redisClient;
