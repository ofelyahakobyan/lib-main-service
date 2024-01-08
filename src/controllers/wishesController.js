import HttpError from 'http-errors';
import serviceBooks  from '../grpcClients/serviceBooks';


class WishesController {
    static list = async (req, res, next) => {
        try {
            const { userId } = req.body;
            const { page = 1, limit = 8 } = req.query;
            const data = await serviceBooks('getWishlistItems', { userId, page, limit });
            res.status(200).json({
                ...data
            })
        }
        catch (er) {
            next(er);
        }
    };

    static add = async (req, res, next) => {
      try {
        const { userId } = req.body;
        const { bookId } = req.params;
        const data = await serviceBooks('addWishlistItem', { userId, bookId });
        res.status(200).json({
          ...data
        })
      }
      catch (er) {
        next(er);
      }
    };
    static wishlistDelete = async (req, res, next) => {
        try {
            const { userID } = req;
            const { bookId } = req.params;
            const where = { userId: userID, bookId, status: 'wish' };
            const item = await UserBooks.findOne({ where });
            if (!item) {
                throw HttpError(404, 'book not found on users wishlist');
            }
            await item.destroy();
            res.status(204).json({ status: 'success' });
        } catch (er) {
            next(er);
        }
    };
}

export default WishesController;