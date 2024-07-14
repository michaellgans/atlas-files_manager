// Users Controller

import dbClient from '../utils/db.js';
import crypto from 'crypto';

class UsersController {
  static async postNew(req, res) {
    try {
      const userDocs = await dbClient.db.collection('users');
      // Body of .json package
      const userEmail = req.body.email;
      const userPassword = req.body.password;
      const hashedPassword = crypto.createHash('sha1').update(userPassword).digest('hex');
      const newDocument = { email: userEmail, password: hashedPassword };

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

      // User already exists: 400
      if (existingRecord !== null) {
        return res.status(400).send("Already Exists"); // added return
      }

      const result = await userDocs.insertOne(newDocument); // added await
      const dataToSend = { id: result.insertedId, email: userEmail };

      return res.status(201).send(dataToSend); // added return
    } catch (err) {
      console.error(err);
    }
  }
}

export default UsersController;
