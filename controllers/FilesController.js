// Files Controller
import redisClient from '../utils/redis.js'
import dbClient from '../utils/db.js';
import { ObjectID } from 'mongodb';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { error } from 'console';
import { send } from 'process';

class FilesController {
  // - Files Controller Class - 
  // Manages Files and File Data creation and storage with MongoDB
  static async postUpload(req, res) {
    // Uploads file to DB

    // Declare file variables
    let userId, fileName, fileType, fileData, filePath, newFileObject, newFolderObject;

    // Authorize User
    try {
      const token = req.headers['x-token'];

      // Wait for Redis to return existing token
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      // Triggers catch
      if (!existingUser) {
        throw err;
      }

    } catch (err) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Validate Data from Request, Create File Object
    try {
      // Check if body has file name
      if (!req.body.name) {
        return res.status(400).send({ error: 'Missing name' });
      } else {
        fileName = req.body.name;
      }

      // Check if body has type and is accepted type
      const acceptedTypes = ['file', 'folder', 'image'];
      if (!req.body.type || !acceptedTypes.includes(req.body.type)) {
        return res.status(400).send({ error: 'Missing type' });
      } else {
        fileType = req.body.type;
      }

      // Check if data is missing unless type is folder
      if (!req.body.data && fileType !== 'folder') {
        return res.status(400).send({ error: 'Missing data' });
      } else if (fileType === 'file' || fileType === 'image') {
        fileData = req.body.data;
      }

      // Set default values for parentId and isPublic
      let parentId = 0;
      let isPublic = false;

      // Check if parentId in data package and db, if in db must have type folder
      if (req.body.parentId) {
        parentId = req.body.parentId;

        // Check if file with parentId is in DB
        const fileDocs = dbClient.db.collection('files');
        const existingFile = await fileDocs.findOne({ _id: new ObjectID(parentId) });

        if (existingFile) {
          if (existingFile.type !== 'folder') {
            return res.status(400).send({ error: 'Parent is not a folder' });
          }
        } else {
          return res.status(400).send({ error: 'Parent not found' });
        }
      }

      if (req.body.isPublic) {
        isPublic = req.body.isPublic;
      }

      // Set File Path
      filePath = process.env.FOLDER_PATH;

      // File path does not exist
      if (!filePath) {
        filePath = '/tmp/files_manager';
      }

      // CHRIS
      // Create File Object
      newFileObject = {
        userId: ObjectID(userId),
        name: fileName,
        type: fileType,
        isPublic: isPublic,
        parentId: ObjectID(parentId),
        localPath: filePath
      };

      // CHRIS
      // Create Folder Object
      newFolderObject = {
        userId: ObjectID(userId),
        name: fileName,
        type: fileType,
        isPublic: isPublic,
        parentId: ObjectID(parentId),
      };

    } catch (err) {
      return res.status(400).send({ error: 'New File Object not Created '});
    }

    // Store file in Database, Create File Locally
    // if Type Not Database
    try {
      // Insert new file object into database
      const fileDocs = dbClient.db.collection('files');

      // CHRIS
      if (fileType === 'folder') {
        const result = await fileDocs.insertOne(newFolderObject);
        newFolderObject._id = result.insertedId;
        return res.status(201).send(newFolderObject);
      }

      // CHRIS
      const result = await fileDocs.insertOne(newFileObject);
      newFileObject._id = result.insertedId;
      // FOR TOMAS :)
      // Result will not contain id.  insertOne()
      // Automatically appends this data as _id to newFileObject

      // Write to new file
      const decodedFileData = Buffer.from(fileData, 'base64').toString('ascii');
      const finalPath = `${filePath}/${uuidv4()}`;

      // Creates parent directory for file creation
      fs.mkdir(filePath, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
        }
      });
      // Writes file to disk ;)
      fs.writeFile(finalPath, decodedFileData, err => {
        if (err) {
          console.error(err);
        } else {
          console.log('File created successfully');
        }
      });

      // Take return from inserted document and create object for response
      return res.status(201).send(newFileObject);
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: 'File upload failed' });
    }
  }

  // Retrieves File Document Based _id
  static async getShow(req, res) {
    // Authorize User by Token (current user)

    let userId;

    try { 
      const token = req.headers['x-token'];

      // Returns token from Redis
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      // Returns userId from MongoDB
      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      // User does not exist: 401
      if (!existingUser) {
        throw err;
      }
    } catch (err) {
      console.error(err);
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Find a file based on userId from GET (owner)
    try {
      const fileId = req.params.id;
      console.log(`File ID param from Curl: ${fileId}`);
      const fileDocs = dbClient.db.collection('files');
      const existingFile = await fileDocs.findOne({ _id: ObjectID(fileId), userId: userId });

      // File does not exist: 401
      if (!existingFile) {
        throw new Error('Not found');
      }
      return res.status(200).send(existingFile);
    } catch (err) {
      console.error(err);
      return res.status(404).send({ error: 'Not found' });
    }
  }

  // Retrieves Files that a user owns by parentId
  static async getIndex(req, res) {
    // Authorize User by Token (current user)

    let userId;

    try { 
      const token = req.headers['x-token'];

      // Returns token from Redis
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      // Returns userId from MongoDB
      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      // User does not exist: 401
      if (!existingUser) {
        throw err;
      }
    } catch (err) {
      console.error(err);
      res.status(401).send({ error: 'Unauthorized' });
    }

    // Pagination - default is 0 if not specified
    const page = parseInt(req.query.page) || 0;
    const pageSize = 20; // TESTED WITH 5
    const skip = page * pageSize;

    // Find all files by userId or parentId
    try {
      const userFiles = dbClient.db.collection('files');
      const parentId = req.query.parentId;

      // Set query to userId as default
      let query = { userId: new ObjectID(userId) }

      // Search by parentId if there is one
      if (parentId) {
        query.parentId = new ObjectID(parentId);
        // ParentId isn't linked to existing files
        const filesWithParent = await userFiles.findOne({ userId: new ObjectID(userId), parentId: new ObjectID(parentId) });

        if (!filesWithParent) {
          return res.status(200).send([]); // send empty array
        }
      }

      // Implement Pagination
      const aggregateQuery = [
        { $match: query },
        { $skip: skip },
        { $limit: pageSize }
      ];

      const allFiles = await userFiles.aggregate(aggregateQuery).toArray();
      return res.status(200).send(allFiles);
    } catch (err) {
      console.error(err);
    }
  }

  // Publishes a document
  static async putPublish(req, res) {
    // Authenticate Current User
    let userId;

    try { 
      const token = req.headers['x-token'];

      // Returns token from Redis
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      // Returns userId from MongoDB
      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      // User does not exist: 401
      if (!existingUser) {
        throw err;
      }
    } catch (err) {
      console.error(err);
      res.status(401).send({ error: 'Unauthorized' });
    }

    try {
      // If no file document is linked to the user 
      // and the ID passed as parameter, return an 
      // error Not found with a status code 404

      // Define Parameters

      // Make Change - updateOne() ???

      // Insert Document
      return

    } catch (err) {
      console.error(err)
    }
  }

  // Unpublishes a document
  static async putUnpublish(req, res) {
    // Authenticate Current User
    let userId;

    try { 
      const token = req.headers['x-token'];

      // Returns token from Redis
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      // Returns userId from MongoDB
      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      // User does not exist: 401
      if (!existingUser) {
        throw err;
      }
    } catch (err) {
      console.error(err);
      res.status(401).send({ error: 'Unauthorized' });
    }

    try {
      // If no file document is linked to the user 
      // and the ID passed as parameter, return an 
      // error Not found with a status code 404

      // Define Parameters

      // Make Change

      // Insert Document
      return

    } catch (err) {
      console.error(err)
    }
  }
}

// Export
export default FilesController;
