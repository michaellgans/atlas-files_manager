// Task 1 - Connecting to MongoDB

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://michaeluser:1Ut55gpPyQ84FxZ0@files-manager-cluster.rqhsejc.mongodb.net/?retryWrites=true&w=majority&appName=Files-Manager-Cluster";

class DBClient {
  constructor() {
    // Database Connection
    this.database = 'files_manager';
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Returns true when connection to MongoDB is successful
  async isAlive() {
    try {
      // Connect the client to the server
      await this.client.connect();
      // Send a ping to confirm a successful connection
      await this.client.db("admin").command({ ping: 1 });
      console.log("Successfully pinged.");
      return true;
    } catch (error) {
      return false;
    }
  }

  // Returns the number of documents in the user collection
  async nbUsers() {
    const db = this.client.db(this.database);
    const userDocs = db.collection('users');
    const userDocCount = userDocs.countDocuments();
    return userDocCount;
  }

  // Returns the number of documents in the files collection
  async nbFiles() {
    const db = this.client.db(this.database);
    const fileDocs = db.collection('files');
    const fileDocCount = fileDocs.countDocuments();
    return fileDocCount;
  }
}

// async function test() {
//   const dbClient = new DBClient();
//   const alive = await dbClient.isAlive();
//   console.log(alive);
//   const users = await dbClient.nbUsers();
//   console.log(users);
//   const files = await dbClient.nbFiles();
//   console.log(files);
// } For Tomas <3 :)

// test();

// Export
const dbClient = new DBClient();
module.exports = dbClient;
