import express from 'express';
import OrdersController from "../controllers/ordersController";
import authorization from "../middlewares/authorization";
import validate from '../middlewares/validate';


const router = express.Router();

/* GET home page. */
router.get('/', OrdersController.list);
router.post('/add', authorization('login'), OrdersController.add);
router.get('/webhook', express.raw({type: 'application/json'}) ,OrdersController.webhook  );
router.get('/test' ,OrdersController.test  );

export default router;
