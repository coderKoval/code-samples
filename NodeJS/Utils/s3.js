import AWS from 'aws-sdk';
import s3Zip from 's3-zip';

import { config } from '@common/libs/config.manager';
import multer from '@koa/multer';
import { AWSConstants, ErrorMessages } from '@utils/constants';
import Logger from '@common/libs/logger';
import { UnprocessableEntityError } from '@common/libs/errorClasses';

export const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 1024 * 1024 * 50;
export const DEFAULT_FILES_AMOUNT_PER_REQUEST = 1;

let S3Client;

export const init = async () => {
  if (!(config.has('AWS_ACCESS_KEY_ID') && config.has('AWS_SECRET_ACCESS_KEY') && config.has('AWS_REGION'))) {
    throw new Error('AWS credentials are not set');
  }

  S3Client = new AWS.S3({
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
    region: config.get('AWS_REGION'),
  });

  await S3Client.listBuckets()
    .promise()
    .then(() => {
      Logger.log('S3 client was initialized');
    })
    .catch(() => {
      Logger.error('S3 credentials are not valid!');
    });
};

export const uploadFileToS3 = async ({ originalname, mimetype, buffer }, path = null, isPublic = true) => {
  const bucketPath = path ? `${AWSConstants.S3.BUCKET}/${path}` : `${AWSConstants.S3.BUCKET}/`;

  const uploadOptions = {
    Bucket: bucketPath,
    Key: `${new Date().getTime()}-${originalname.replace(/ /g, '_')}`,
    Body: buffer,
    ContentType: mimetype,
  };
  if (isPublic) {
    uploadOptions.ACL = 'public-read';
  }
  const file = await S3Client.upload(uploadOptions).promise();

  return file.Location;
};

export const uploadFileToFileStorage = async (file, pathToFolder = '') => {
  if (!file) {
    return null;
  }

  return uploadFileToS3(file, pathToFolder);
};

export const archiveAndDownloadFilesAsZip = async (files, stream) => {
  s3Zip
    .archive(
      {
        s3: S3Client,
        bucket: AWSConstants.S3.BUCKET,
      },
      '',
      files,
    )
    .pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
};

export const fileUploadLimits = {
  files: DEFAULT_FILES_AMOUNT_PER_REQUEST,
  fileSize: DEFAULT_MAX_FILE_SIZE_IN_BYTES,
};

export const defaultFileFilter = (req, file, cb) => {
  if (AWSConstants.DEFAULT_ALLOWED_IMAGE_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new UnprocessableEntityError({
        message: ErrorMessages.MSG_PROHIBITED_FILE_TO_UPLOAD_TYPE,
        payload: {
          error:
            'Invalid file type. Only jpg, png, svg image and video/webm, video/ogg, video/mp4 video files are allowed.',
        },
      }),
    );
  }
};

export const defaultMulterForImages = multer({
  limits: fileUploadLimits,
  fileFilter: defaultFileFilter,
});

export const removeMediaFromStorage = async (url, entity, entityId) =>
  new Promise((resolve, reject) => {
    const bucketPath = `${AWSConstants.S3.BUCKET}/${entity}/${entityId}`;
    const parts = url.split('/');
    const key = parts[parts.length - 1];

    const removeOptions = {
      Bucket: bucketPath,
      Key: key,
    };

    S3Client.deleteObject(removeOptions, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
