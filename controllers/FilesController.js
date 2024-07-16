// Files Controller
import redisClient from '../utils/redis.js'
import dbClient from '../utils/db.js';
import { ObjectID } from 'mongodb';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class FilesController {
  // - Files Controller Class - 
  // Manages Files and File Data creation and storage with MongoDB
  static async postUpload(req, res) {
    // Uploads file to DB

    // Declare file variables
    let userId, fileName, fileType, fileData, filePath, newFileObject;

    // Authorize User
    try {
      const token = req.headers['x-token'];

      // Wait for Redis to return existing token
      const fullToken = `auth_${token}`;
      userId = await redisClient.get(fullToken);

      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

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
        const existingFile = await fileDocs.findOne({ parentId: parentId });

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

      // Create File Object
      newFileObject = {
        userId: userId,
        name: fileName,
        type: fileType,
        isPublic: isPublic,
        parentId: parentId,
        localPath: filePath
      };

    } catch (err) {
      return res.status(400).send({ error: 'New File Object not Created '});
    }

    // Store file in Database, Create File Locally
    try {
      // Insert new file object into database
      const fileDocs = dbClient.db.collection('files');
      const result = await fileDocs.insertOne(newFileObject);
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
      return res.status(400).send({ error: 'File upload failed' });
    }
  }
}

// Export
export default FilesController;
