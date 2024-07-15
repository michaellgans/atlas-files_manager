// Files Controller
import redisClient from '../utils/redis.js'
import dbClient from '../utils/db.js';
import { ObjectID } from 'mongodb';

class FilesController {
  // - Files Controller Class - 
  // Manages Files and File Data creation and storage with MongoDB
  static async postUpload(req, res) {
    // Uploads file to DB

    // Authorize User
    try {
      const token = req.headers['x-token'];

      // Wait for Redis to return existing token
      const fullToken = `auth_${token}`;
      const userId = await redisClient.get(fullToken);

      const userDocs = dbClient.db.collection('users');
      const existingUser = await userDocs.findOne({ _id: ObjectID(userId) });

      if (!existingUser) {
        throw err;
      }

      console.log("You're Authorized YAY!!!!!!")
    } catch (err) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Validate Data from Request, Create File Object
    try {
      // Check if body has file name
      if (!req.body.name) {
        return res.status(400).send({ error: 'Missing name' });
      } else {
        const fileName = req.body.name;
      }

      // Check if body has type and is accepted type
      const acceptedTypes = ['file', 'folder', 'image'];
      if (!req.body.type || !acceptedTypes.includes(req.body.type)) {
        return res.status(400).send({ error: 'Missing type' });
      } else {
        const fileType = req.body.type;
      }

      // Check if data is missing unless type is folder
      if (!req.body.data && fileType !== 'folder') {
        return res.status(400).send({ error: 'Missing data' });
      } else if (fileType === 'file' || fileType === 'image') {
        const fileData = req.body.data;
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
    } catch (err) {
      return
    }
  }
}

export default FilesController;
