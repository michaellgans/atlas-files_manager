// Authenticates User - Utils in progress

// import dbClient from './db.js';
// import redisClient from './redis.js';
// import { ObjectID } from 'mongodb';

// export default async function authUser(req, res) {
//   try {
//     const token = req.headers['x-token'];

//     // Wait for Redis to return existing token
//     const fullToken = `auth_${token}`;
//     userId = await redisClient.get(fullToken);
  
//     const userDocs = dbClient.db.collection('users');
//     const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });
  
//     if (!existingUser) {
//       throw err;
//     }
//     return userId;
//   } catch (err) {
//     return new Error(err);
//   }
// }
