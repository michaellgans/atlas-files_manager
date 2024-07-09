// Task 0 - Redis Utils: Contains the Class Redis Client

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
}

// Testing
const client = new RedisClient();
setTimeout(() => {
  console.log(client.isAlive());
}, 3000);
