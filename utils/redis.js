// Task 0 - Redis Utils: Contains the Class Redis Client

import redis from 'redis';

class RedisClient {
  constructor() {
    try {
      this.client = redis.createClient();
    } catch (err) {
      console.log('Could not create the client', err);
    }

    // Message Displayed on Connection
    this.client.on('connect', () => {
      console.log('Successfully connected to the client! :)');
    });

    // Message Displayed on Error
    this.client.on('error', () => {
      console.log('Could not connect to the client. :(');
    });
  }

  // Function to test if client is connected
  isAlive() {
    if (this.client.ready) {
      return true
    }
    return false
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
