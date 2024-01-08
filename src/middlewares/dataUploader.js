import multer from 'multer';
import HttpError from 'http-errors';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const { DATA_FILE_MAX_SIZE } = process.env;

// TODO multer disk storage

const MIME_TYPES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${os.tmpdir()}`)
  },
  filename: function (req, file, cb) {
    const name= file.originalname.split('.')[0];
    const fileName =`${uuidv4()}_${name}.xlsx`;
    req.fileName=`${os.tmpdir()}/${fileName}`;
    cb(null, fileName)
  }
})


const limits = {
  fileSize: DATA_FILE_MAX_SIZE,
  files: 1,
};

const upload = multer({
  storage,
  limits,
}).single('sheet');

const uploader = (req, res, next) => {
  upload(req, res, (er) => {
    try {
      const { file } = req;
      if (!file) {
        return next();
      }
      if (!(MIME_TYPES.includes(file.mimetype))) {
        throw HttpError(400, 'invalid file type, please upload only images');
      }
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