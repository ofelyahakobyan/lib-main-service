import express from 'express';
import books from './books';
import categories from './categories';
import users from './users';
import wishes from './wishes';
import authors from './authors';
import orders from './orders';
import ServiceUsers from '../grpcClients/serviceUsers';
import ServiceBooks from '../grpcClients/serviceBooks';

// TODO return unused code
// import TestController from "../controllers/testController";
// import uploader from '../middlewares/dataUploader';

const router = express.Router();

// TODO This router should return the status of all services and DB
router.get('/', async (req, res, next) => {
  try {
    const user = await ServiceUsers('test', {});
    if (!user.user_id) {
      res.status(503).json({
        status: 'users service is unavailable',
      });
    }
    const book = await ServiceBooks('test', {});
    if (!book.book_id) {
      res.status(503).json({
        status: 'books service is unavailable',
      });
    }
    res.json({
      title: 'digital library',
      status: 'success',
      user: user.user_id,
      book: book.book_id,
    });
  } catch (e) {
    next(e);
  }
});

router.use('/books', books);
router.use('/users', users);
router.use('/categories', categories);
router.use('/wishes', wishes);
router.use('/authors', authors);
router.use('/orders', orders);

/* ====== SOME TEST ROUTER ========== */

// router.post('/add', uploader,  TestController.add);
// router.get('/export', TestController.export);

export default router;
