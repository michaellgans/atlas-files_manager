// File Queue for subprocess that generates thumbnails
import Queue from 'bull';
import { thumbnail } from 'image-thumbnail';
import dbClient from './utils/db.js';
import fs from 'fs';

const fileQueue = new Queue('my-file-queue');

fileQueue.process(async (job) => {
  try {
    if (!fileId) {
      throw new Error('Missing FileId');
    }
    if (!userId) {
      throw new Error('Missing userId');
    }
    const fileDocs = dbClient.db.collection('files');
    const existingFile = await fileDocs.fineOne({ _id: job.data.fileId, userId: job.data.userId });

    if (!existingFile) {
      throw new Error('File not found');
    }

    const widths = [100, 250, 500]
    const outputPaths = [
      `${existingFile.localPath}_${widths[0]}`,
      `${existingFile.localPath}_${widths[1]}`,
      `${existingFile.localPath}_${widths[2]}`
    ]

    const options = widths.map(width => ({ width }));
    const thumbs = await Promise.all(options.map(opt => thumbnail(existingFile.localPath, opt)));

    await Promise.all(thumbs.map((thumb, index) => fs.writeFile(outputPaths[index], thumb)));
  } catch (err) {
    throw new Error('Process Failed');
  }
});

export default fileQueue;
