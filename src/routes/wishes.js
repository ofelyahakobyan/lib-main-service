import express from 'express';
import WishesController from '../controllers/wishesController';
import authorization from '../middlewares/authorization';

const router = express.Router();

/* GET home page. */

router.get('/', authorization('login'),  WishesController.list);

export default router;
