// Users Controller

import dbClient from '../utils/db.js';
import sha1 from 'crypto-js/sha1.js';

class UsersController {
  static async postNew(req, res) {
    const userDocs = await dbClient.db.collection('users');
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const hashedPassword = sha1(userPassword);
    const newDocument = { email: userEmail, password: hashedPassword };

    // Email is missing: 400
    if (!userEmail) {
      res.status(400).send("Missing email");
    }
    if (!userPassword) {
      res.status(400).send("Missing password");
    }

    const existingRecord = await userDocs.findOne({ email: userEmail });
    console.log(existingRecord);

    if (existingRecord !== null) {
      res.status(400).send("Already Exists");
    }

    const result = userDocs.insertOne(newDocument);
    const postResponse = { id: result.insertedId, email: userEmail };

    console.log(postResponse);
    res.status(201).send(postResponse);
  }
}

export default UsersController;

// Syntax for if logic 
// Response method, status method, json method
// if (!userEmail) {
//   return res.status(400).json({ error: "Message Here" });
// };

// Mongo Methods
// Can we access the collection by importing db.json into this
// and calling db.nbFiles
// .save() - saves data to MongoDB?
// .insertOne() - inserts one object into the DB
// .insertMany() - inserts an array of objects into the DB
