import { BadRequestException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

export interface ObjectStorageData {
  ETag: string;
  Location: string;
  key: string;
  Bucket: string;
}

@Injectable()
export class ImageService {
  private readonly s3: AWS.S3;
  private readonly FILE_LIMIT_SIZE = 10485760;
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
    if (file.size > this.FILE_LIMIT_SIZE) {
      throw new BadRequestException('파일 사이즈는 10MB를 넘을 수 없습니다.');
    }
    const resizedImageBuffer = await sharp(file.buffer)
      .resize({ height: 600 })
      .toFormat('webp')
      .toBuffer();

    const fileName = `${folder}/${Date.now().toString()}-${file.originalname.replace(
      /[^a-zA-Z0-9.]/g,
      '_',
    )}.webp`;

    const param = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ACL: 'public-read',
      Body: resizedImageBuffer,
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
