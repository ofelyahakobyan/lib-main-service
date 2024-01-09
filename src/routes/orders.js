import express from 'express';
import OrdersController from '../controllers/ordersController';
import authorization from '../middlewares/authorization';
import validate from '../middlewares/validate';
import orders from '../schemas/orders';

const router = express.Router();

const { invoice } = orders;

/* GET home page. */
router.get('/', OrdersController.list);
router.post('/add', authorization('login'), OrdersController.add);
router.get(
  '/invoice/:orderId',
  validate(invoice),
  authorization('login'),
  OrdersController.invoice,
);
router.get(
  '/webhook',
  express.raw({ type: 'application/json' }),
  OrdersController.webhook,
);
// router.get('/test', OrdersController.test);

export default router;
