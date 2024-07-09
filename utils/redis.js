// Task 0 - Redis Utils: Contains the Class Redis Client

import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Message Displayed on Connection
    this.client.on('connect', () => {
      console.log('Successfully connected to the client!');
    });

    // Message Displayed on Error
    this.client.on('error', () => {
      console.log('Could not connect to the client.');
    });
  }
}

// Testing
const client = new RedisClient();
