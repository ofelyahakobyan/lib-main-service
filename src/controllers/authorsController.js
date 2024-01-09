import path from 'path';
import serviceBooks from '../grpcClients/serviceBooks';
import GCS from '../helpers/gcs';

const { BUCKET_NAME, GCS_BASE_URL } = process.env;

class AuthorsController {
  static list = async (req, res, next) => {
    try {
      const data = await serviceBooks('getAuthorsList', req.params);
      res.status(200).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

  static add = async (req, res, next) => {
    try {
      let avatar = '';
      if (req.file) {
        const destinationFilename = `authors/author_${req.body.firstName.toLowerCase()}_${
          req.fileName
        }`;
        await GCS.upload(BUCKET_NAME, req.file, destinationFilename);
        avatar = path.join(GCS_BASE_URL, BUCKET_NAME, destinationFilename);
        req.body.avatar = avatar;
      }
      const data = await serviceBooks('addAuthor', req.body);
      if (avatar && !data) {
        setImmediate(() =>
          GCS.delete(BUCKET_NAME, `authors/${avatar.split('/')[4]}`),
        );
      }
      res.status(201).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

  // TODO THIS PART SHOULD BE DONE
  static edit = async (req, res, next) => {
    try {
      const { categoryId } = req.params;
      const { category, parentCategory = null } = req.body;
      const data = await serviceBooks('editCategory', {
        categoryId,
        category,
        parentCategory,
      });
      res.status(201).json({
        ...data,
      });
    } catch (er) {
      next(er);
    }
  };

  static delete = async (req, res, next) => {
    try {
      const data = await serviceBooks('deleteAuthor', req.params);
      res.status(204).json({
        ...data,
      });
    } catch (er) {
      next(er);
    }
  };

  static getSubs = async (req, res, next) => {
    try {
      const data = await serviceBooks('getSubcategories', req.params);
      res.status(200).json({
        ...data,
      });
    } catch (er) {
      next(er);
    }
  };

  static single = async (req, res, next) => {
    try {
      const data = await serviceBooks('getAuthorSingle', req.params);
      res.json({
        ...data,
      });
    } catch (er) {
      next(er);
    }
  };

  // get all subcategories of a category
}

export default AuthorsController;
