// Task 0 - Redis Utils: Contains the Class Redis Client

import { interfaces } from 'mocha';
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

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
  async set(key, value, time) {
    try {
      await this.client.set(key, value, time);
      console.log(`Your key ${key} has been set with a value of ${value} and a duration of ${time}.`)
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

// Testing
// const client = new RedisClient();

// setTimeout(() => {
//   console.log(client.isAlive());
// }, 3000);

// client.set('ChrisAndMichael', 42, 9000);

// const value = client.get('ChrisAndMichael');
// console.log(value);
