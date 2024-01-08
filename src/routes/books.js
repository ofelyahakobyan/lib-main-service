import express from 'express';
import BooksController from '../controllers/booksController';
import authorization from '../middlewares/authorization';
import limiter from '../middlewares/limiter';

const router = express.Router();

router.get('/sheet', authorization('admin'),  BooksController.sheet);
//TODO Add validation for input data
router.get('/:bookId', BooksController.single);
//TODO Add validation for input data
router.post('/add', BooksController.add);
router.get('/',  limiter,  BooksController.list);


export default router;
