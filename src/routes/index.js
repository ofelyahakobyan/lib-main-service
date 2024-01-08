import express from 'express';
import books from './books';
import categories from './categories';
import users from './users';
import wishes from './wishes';
import authors from './authors';
import orders from './orders';
import TestController from "../controllers/testController";
import uploader from '../middlewares/dataUploader';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'success',
    title: 'digital library',
  });
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
