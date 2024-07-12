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
    // Connect the client to the server
    this.client.connect((err) => {
      if (err) {
        console.err('Failed to connect to MongoDB', err);
        return;
      }
      console.log('Connected to MongoDB');
      this.db = this.client.db(this.database);
    });
  }

  // Returns true when connection to MongoDB is successful
  async isAlive() {
    try {
      // Send a ping to confirm a successful connection
      // this.client.ready();
      await this.client.connect();
      console.log("Successfully pinged.");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Returns the number of documents in the user collection
  async nbUsers() {
    // const db = this.client.db(this.database);
    const userDocs = this.db.collection('users');
    const userDocCount = userDocs.countDocuments();
    return userDocCount;
  }

  // Returns the number of documents in the files collection
  async nbFiles() {
    // const db = this.client.db(this.database);
    const fileDocs = this.db.collection('files');
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
// }
// For Tomas <3 :)

// test();

// Export
const dbClient = new DBClient();
module.exports = dbClient;
