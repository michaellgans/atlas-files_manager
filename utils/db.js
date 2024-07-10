// Task 1 - Connecting to MongoDB

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://michaeluser:1Ut55gpPyQ84FxZ0@files-manager-cluster.rqhsejc.mongodb.net/?retryWrites=true&w=majority&appName=Files-Manager-Cluster";

class DBClient {
  constructor() {
    // Database Connection
    this.client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

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
    // TODO: Do we need to close the connection?
    } finally {
      await this.client.close();
    }
  }
}

async function test() {
  const dbClient = new DBClient();
  const alive = await dbClient.isAlive();
  console.log(alive);
}

test();
