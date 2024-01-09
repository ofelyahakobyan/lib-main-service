import HttpError from 'http-errors';
import { Stripe } from 'stripe';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

import ServiceOrders from '../grpcClients/serviceOrders';
import ServiceUsers from '../grpcClients/serviceUsers';
import ServiceBooks from '../grpcClients/serviceBooks';

import puppeteer from '../services/puppeteer';

const { WEBHOOK_SECRET, STRIPE_SECRET_KEY } = process.env;

const stripe = new Stripe(STRIPE_SECRET_KEY);
const endpointSecret = WEBHOOK_SECRET;

class OrdersController {
  // TODO logic of particular user orders list should be implemented
  static list = async (req, res, next) => {
    try {
      const { userId } = req;
      const data = await ServiceOrders('getOrdersList', { id: +userId });
      res.status(200).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

  static add = async (req, res, next) => {
    try {
      const { userId } = req;
      const { books = [] } = req.body;
      //
      //        const webhookEndpoint = await stripe.webhookEndpoints.create({
      //        enabled_events: ['checkout.session.completed'],
      //        url: 'http://localhost/4000/api/v2/orders/webhook',
      // });
      let data = {};
      const user = await ServiceUsers('getProfile', { userId });
      const existingBooks = await Promise.all(
        books.map(async (bookId) => {
          const result = await ServiceBooks('getSingleBook', { bookId });
          return {
            bookId,
            price: result.book.price,
            title: result.book.title,
            description: result.book.description,
          };
        }),
      );
      if (user) {
        data = await ServiceOrders('addOrder', {
          userId,
          email: user.user.email,
          books: existingBooks,
        });
      }
      res.status(200).json({
        ...data,
      });
    } catch (e) {
      next(e);
    }
  };

  static webhook = async (req, res, next) => {
    try {
      // TODO transaction or session_id should be sent with req.body
      let event;
      const { type } = req.body;
      if (endpointSecret) {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        event = req.body;
        const data = req.body.data.object;
        if (type === 'checkout.session.completed') {
          const customer = await stripe.customers.retrieve(data.customer);
          // TODO send data to grpc and data into
          console.log(customer, 555);
          await ServiceOrders('addItemsToDB', customer.metadata);
        }
      }
      if (type === 'checkout.session.expired') {
        console.log(type);
        //
      }
      if (!event) {
        throw HttpError(400, { error: { message: 'webhook error' } });
      }

      res.status(200).json({
        status: 'success',
      });
    } catch (e) {
      next(e);
    }
  };

  static invoice = async (req, res, next) => {
    try {
      // TODO data of actual order
      // 1. get order id from req.params +
      // 2. get user id from req (user is logged in) +
      const { userId } = req;
      const { orderId } = req.params;
      const filePath = path.join(path.resolve(), 'src/views/invoice.pdf');
      // 3. get user data from serviceUsers+
      const { user } = await ServiceUsers('getProfile', { userId });
      if (!user) {
        throw HttpError(422);
      }
      // 4. get order data from serviceOrders +
      const order = await ServiceOrders('getTransaction', {
        orderId: +orderId,
      });
      // 5. get book data
      const { book } = await ServiceBooks('getSingleBook', {
        bookId: +order.bookId,
      });
      // 6. generate order data object +
      const data = {
        title: book.title,
        price: book.price,
        customer: user.firstName,
        transaction: order.transaction,
        date: moment(new Date()).format('LLLL'),
      };
      // 7. call puppeteer with that data +
      await puppeteer(data);
      res.contentType('application/pdf');
      res.attachment('invoice.pdf');
      res.sendFile(filePath, () => {
        setImmediate(() => {
          fs.rmSync(filePath);
        });
      });
    } catch (e) {
      next(e);
    }
  };

  // static test = async (req, res, next) => {
  //   try {
  //
  //
  //     const customer = await stripe.customers.create({
  //       name: 'Jenny Rosen',
  //       email: 'jennyrosen@example.com',
  //     });
  //
  //     const list = await stripe.customers.list({});
  //
  //     const cust = await stripe.customers.retrieve('cus_PFh0hzZKMhn51f');
  //     console.log(cust);
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'stripe test api',
  //     });
  //   } catch (e) {
  //     next(e);
  //   }
  // };
}

export default OrdersController;
