import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import serviceUsers from '../grpcClients/serviceUsers';

const { JWT_SECRET } = process.env;

const authorization = (type) => async (req, res, next) => {
  try {
    // eslint-disable-next-line no-shadow
    const { authorization = '' } = req.headers;
    if (!authorization) {
      throw HttpError(401);
    }
    if (type === 'login') {
      const { userId } = jwt.verify(
        authorization.replace('Bearer ', ''),
        JWT_SECRET,
      );
      if (!userId) {
        throw HttpError(401);
      }
      const user = await serviceUsers('getProfile', { userId });
      if (!user.user) {
        throw HttpError(401);
      }
      req.userId = userId;
      return next();
    }
    if (type === 'admin') {
      const { userId, isAdmin } = jwt.verify(
        authorization.replace('Bearer ', ''),
        JWT_SECRET,
      );
      if (!userId || !isAdmin) {
        throw HttpError(403);
      }
      const user = await serviceUsers('getProfile', { userId });
      if (!user.user) {
        throw HttpError(403);
      }
      req.userId = userId;
      req.isAdmin = isAdmin;
      return next();
    }
    return next();
  } catch (e) {
    return next(e);
  }
};

export default authorization;
