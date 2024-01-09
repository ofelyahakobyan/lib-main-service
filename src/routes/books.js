import express from 'express';
import BooksController from '../controllers/booksController';
import authorization from '../middlewares/authorization';
import limiter from '../middlewares/limiter';
import books from '../schemas/books';
import validate from '../middlewares/validate';

const { add, single } = books;

const router = express.Router();

router.get('/sheet', authorization('admin'), BooksController.sheet);

// TODO Add validation for input data
router.get('/:bookId', validate(single), BooksController.single);
// TODO Add validation for input data
router.post('/add', validate(add), BooksController.add);
router.get('/', limiter, BooksController.list);

export default router;
