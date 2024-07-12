// Users Controller

import dbClient from '../utils/db.js';

class UsersController {
  static async  postNew(req, res) {
    console.log(await dbClient.isAlive());
    // const db = dbClient.client.db(this.database);
    // const userDocs = db.collection('users');
    // const userDocCount = userDocs.countDocuments();
    // console.log(userDocCount);
    // const userEmail = req.body.email;
    // const userPassword = req.body.password;

    // console.log(userEmail);
    // console.log(userPassword);

    // Email is missing: 400
    // if (!userEmail)
  }
}

UsersController.postNew();

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