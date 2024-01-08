import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';

const { JWT_SECRET, BASE_URL } = process.env;

const authorization =(type)=> (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    if (!authorization) {
      throw HttpError(401);
    }
    if(type === 'login'){
      const { userId } = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);
      if (!userId) {
        throw HttpError(401);
      }
      req.userId = userId;
      return next();
    }
    if(type === 'admin'){
      const { userId, isAdmin } = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);
      if (!userId || !isAdmin) {
        throw HttpError(403);
      }
      req.userId = userId;
      req.isAdmin = isAdmin;
      return next();
    }
    return next();

  } catch (er) {
    return next(er);
  }
};

export default authorization;
