import serviceBooks from '../grpcClients/serviceBooks';

class CategoriesController {
  static add = async (req, res, next) => {
    try {
      // const d = await serviceBooks('getSingle', req.body);

      // console.log(d, 666)
      const data = await serviceBooks('addCategory', req.body);
      res.status(201).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

  static list = async (req, res, next) => {
    try {
      const data = req.params.categoryId
        ? await serviceBooks('getSubcategories', req.params)
        : await serviceBooks('getCategories', req.query);
      res.status(200).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

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
      const data = await serviceBooks('deleteCategory', req.params);
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
      const data = await serviceBooks('getSingleCategory', req.params);
      res.json({
        ...data,
      });
    } catch (er) {
      next(er);
    }
  };

  // get all subcategories of a category
}

export default CategoriesController;
