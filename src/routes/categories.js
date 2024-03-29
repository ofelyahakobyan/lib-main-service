import express from 'express';
import CategoriesController from '../controllers/categoriesController';
import validate from '../middlewares/validate';
import categories from '../schemas/categories';


const router = express.Router();

const { add, list, edit, delete: del } = categories;

router.get('/', validate(list), CategoriesController.list);
router.post('/', validate(add), CategoriesController.add);
router.patch('/:categoryId', validate(edit), CategoriesController.edit);
router.delete('/:categoryId', validate(del), CategoriesController.delete);
router.get('/:categoryId', CategoriesController.list);
router.get('/single/:categoryId', CategoriesController.single);


export default router;
