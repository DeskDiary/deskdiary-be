import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

export interface ObjectStorageData {
  ETag: string;
  Location: string;
  key: string;
  Bucket: string;
}

@Injectable()
export class ImageService {
  private readonly s3: AWS.S3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<ObjectStorageData> {
    const param = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${Date.now().toString()}-${file.originalname}`,
      ACL: 'public-read',
      Body: file.buffer,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(param, (err, data) => {
        if (err) {
          console.error('Error occurred:', err);
          reject(err);
        }
        console.log('Original File name:', file.originalname);
        resolve(data);
      });
    });
  }

  async deleteImage(fileName: string) {
    const param = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(param, (err, data) => {
        if (err) {
          reject(err.message);
        }
        resolve(data);
      });
    });
  }
}