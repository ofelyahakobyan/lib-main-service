import multer from 'multer';
import HttpError from 'http-errors';
import MulterGoogleCloudStorage from 'multer-cloud-storage';
import _ from 'lodash';
import {v4 as uuidv4} from "uuid";
import path from 'node:path';

const {AVATAR_MAX_SIZE, BUCKET_NAME, GCS_BASE_URL, GOOGLE_PROJECT_ID, KEY_FILE_NAME}= process.env;

 const  storage =  MulterGoogleCloudStorage({
   bucket: BUCKET_NAME,
   projectId: GOOGLE_PROJECT_ID,
   keyFilename: KEY_FILE_NAME,
   getContentType( req, file ) {
     return req.file.mimetype;
   },
   getFilename(req, file, cb) {
     const name = file.originalname.split('.')[0];
     const ext = file.mimetype.split('/')[1];
     const fileName = `user-${uuidv4()}_${name}.${ext}`;
     const avatar = path.join(GCS_BASE_URL, BUCKET_NAME, fileName);
     req.body.avatar=avatar;
     cb(null,fileName);
   }
 }).storageEngine();

const limits = {
  fileSize: AVATAR_MAX_SIZE,
  files: 1,
};

const upload = multer({
  storage,
  limits,
}).single('avatar');

const uploader = (req, res, next) => {
  upload(req, res, (er) => {
    try {
      const { file } = req;
      if (!file) {
        return next();
      }
      if (!(file.mimetype.startsWith('image'))) {
        throw HttpError(400, 'invalid file type, please upload only images');
      }
      // here should be file name generated

      if (_.isEmpty(er)) {
        return next();
      }
      if (er?.code === 'LIMIT_FILE_SIZE') {
        throw HttpError(413, er.message);
      }
      if (er?.code === 'LIMIT_FILE_COUNT') {
        throw HttpError(409, er.message);
      }
      if (er instanceof multer.MulterError) {
        throw HttpError(400);
      }
      return next();
    } catch (er) {
      next(er);
    }
  });
};
export default uploader;