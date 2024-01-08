import { rateLimit } from 'express-rate-limit';
import HttpError from "http-errors";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 2,
  standardHeaders: 'draft-7',
  handler: (req, res)=>{
    throw new HttpError(429, 'requests limit is exceeded')
  },
  skip:(req, res)=>{
      return req.userId == 59
  },
  keyGenerator: function(req, res){
    // HERE should be added some logic for returning other key
    return req.ip;
  },
})


export default limiter;
