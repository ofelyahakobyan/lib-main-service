import serviceOrders from '../grpcClients/serviceOrders';
import ServiceUsers from "../grpcClients/serviceUsers";
import ServiceBooks from "../grpcClients/serviceBooks";
import HttpError from "http-errors";

import {Stripe} from "stripe";
import ServiceOrders from "../grpcClients/serviceOrders";

const {WEBHOOK_SECRET, STRIPE_SECRET_KEY} =process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);
const endpointSecret = WEBHOOK_SECRET;


class OrdersController {

  // TODO logic of particular user orders list should be implemented
  static list = async (req, res, next) => {
    const {userId}=req;
    try {
      const data = await serviceOrders('getOrdersList', {id:+id});
      res.status(200).json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  };
  static add = async (req, res, next) => {
    try {
      const {userId}=req;
      const {books=[]}=req.body;
//
//        const webhookEndpoint = await stripe.webhookEndpoints.create({
//        enabled_events: ['checkout.session.completed'],
//        url: 'http://localhost/4000/api/v2/orders/webhook',
// });
      let data={};
      const user = await ServiceUsers('getProfile', {userId});
      const existingBooks = await Promise.all(
        books.map(async bookId=> {
            const result = await ServiceBooks('getSingleBook', {bookId});
            return {
              bookId,
              price: result.book.price,
              title: result.book.title,
              description: result.book.description
            }
          }
        )
      );
      if(user){
        data = await serviceOrders('addOrder', {userId, email:user.user.email, books:existingBooks});
      }
      res.status(200).json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  };
  static webhook = async (req, res, next) => {
    try {
      //TODO transaction or session_id should be send with req.body
      const { session_id } = req.body;
        let event;
        console.log(req.body);

        if(endpointSecret){
          const sig = req.headers['stripe-signature'];
          event =  stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            event  = req.body;
            const type = req.body.type;
            const data = req.body.data.object;
          if(type === 'checkout.session.completed'){
            console.log(req.body, 888);
           const customer = await stripe.customers.retrieve(data.customer);
           // TODO send data to grpc and data into
            await ServiceOrders('addItemsToDB', customer.metadata);
          }
        }

        if(type === 'checkout.session.expired'){
          console.log(type);
         //
        }
        if(!event){
          throw  HttpError(400, {error: {message: 'webhook error'}} );
        }

      res.status(200).json({
        status:'success'
      })
    } catch (e) {
      next(e)
    }
  };

  static test = async (req, res, next) => {
    try {
      const {userId}=req;


      const customer = await stripe.customers.create({
        name: 'Jenny Rosen',
        email: 'jennyrosen@example.com',
      });

      const list = await stripe.customers.list({});

      const cust = await stripe.customers.retrieve('cus_PFh0hzZKMhn51f');
      console.log(cust);
      res.status(200).json({
      status: 'success',
      message: 'stripe test api'
      })
    } catch (e) {
      next(e)
    }
  };

}




export default OrdersController;