// Users Controller

import dbClient from '../utils/db.js';
import sha1 from 'crypto-js/sha1';

class UsersController {
  static async postNew(req, res) {
    const userDocs = dbClient.db.collection('users'); // removed await
    // Body of .json package
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const hashedPassword = sha1(userPassword);
    const newDocument = { email: userEmail, password: hashedPassword };

    console.log("New Document:", newDocument);

    // Email is missing: 400
    if (!userEmail) {
      return res.status(400).send("Missing email"); // added return
    }
    // Password is missing: 400
    if (!userPassword) {
      return res.status(400).send("Missing password"); // added return
    }

    // Returns null when no record is found
    const existingRecord = await userDocs.findOne({ email: userEmail });
    console.log(existingRecord);

    // User already exists: 400
    if (existingRecord !== null) {
      return res.status(400).send("Already Exists"); // added return
    }

    const result = await userDocs.insertOne(newDocument); // added await
    const dataToSend = { id: result.insertedId, email: userEmail };

    console.log(dataToSend);
    return res.status(201).send(dataToSend); // added return
  }
}

export default UsersController;
