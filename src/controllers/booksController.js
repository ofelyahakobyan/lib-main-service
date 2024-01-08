import serviceBooks from '../grpcClients/serviceBooks';
import serviceUsers from "../grpcClients/serviceUsers.js";
import HttpError from "http-errors";

class BooksController {
    static list = async (req, res, next) => {
        try {
            const data = await serviceBooks('getBooksList', req.query);
            res.json({
                ...data
            })
        } catch (e) {
            next(e)
        }
    }
    static single = async (req, res, next) => {
    try {
      const data = await serviceBooks('getSingleBook', req.params);
      res.json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  }
    static add = async (req, res, next) => {
    try {
      const data = await serviceBooks('addBook', req.body);
      res.json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  }

  // TODO admin authorization
  //  static sheet = async (req, res, next) => {
  //   try {
  //     const {userId, isAdmin} = req;
  //     // DONE verify user as admin
  //     if(!userId || !isAdmin){
  //       throw HttpError(403);
  //     }
  //      const user = await serviceUsers('getAdminProfile', {userId});
  //      if(!user.user){
  //        throw HttpError(403);
  //      }
  //
  //       const books = await serviceBooks('getBooksSheet', {});
  //      books.on('data', (d)=>{
  //        console.log(d, 111);
  //      })
  //     books.on('end', ()=>{
  //       console.log('stream ended')
  //     })
  //     //  res.json({
  //     //   status:'ok'
  //     // })
  //   } catch (e) {
  //     next(e)
  //   }
  // }
}

export default BooksController;