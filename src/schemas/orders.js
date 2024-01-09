import Joi from 'joi';

const orders = {
  invoice: {
    params: Joi.object({ orderId: Joi.number().integer().min(1).required() }),
  },
};
export default orders;
