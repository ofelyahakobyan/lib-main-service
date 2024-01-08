import serviceUsers from '../grpcClients/serviceUsers';
import GCS from '../helpers/gcs';
import path from 'path';


const {BUCKET_NAME, GCS_BASE_URL}= process.env;

class UsersController {
    static list = async (req, res, next) => {
        try {
            const data = await serviceUsers('getUsersList', req.params);
            res.json({
                ...data
            })
        } catch (e) {
            next(e)
        }
    }

    // ======= USERS ACTIVITY MIDDLEWARES ====== //
    static registration = async (req, res, next) => {
        try {
          let data=null;
          let fileName=null;
            const { file } = req;
            //TODO:  here should be file managed and avatar path added  to the user database
          if(file){
             const name = file.originalname.split('.')[0];
             const ext = file.mimetype.split('/')[1];
             fileName = `user-${uuidv4()}_${name}.${ext}`;
             const avatar = path.join(GCS_BASE_URL, BUCKET_NAME, fileName);
             req.body.avatar = avatar;
          }
             data = await serviceUsers('userRegistration', req.body);
             if(file && data){
               await GCS.uploadFile(BUCKET_NAME, file, fileName);
             }
            res.status(201).json({
                ...data
            })
        } catch (e) {
            if(req.file){
               await GCS.deleteFile(BUCKET_NAME, fileName).catch(e => console.log(e));
            }
            next(e)
        }
    }
    static login = async (req, res, next) => {
    try {
      const data = await serviceUsers('login', req.body);
      res.status(200).json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  }
    static passwordForgot = async (req, res, next) => {
    try {
      const data = await serviceUsers('forgotPassword', req.body);
      res.status(200).json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  }
    static passwordReset = async (req, res, next) => {

    try {
      const data = await serviceUsers('resetPassword', req.body );
      res.status(200).json({
        ...data
      })
    } catch (e) {
      next(e)
    }
  }

   // ====== USERS PROFILE MIDDLEWARES ====== //
    static getProfile = async (req, res, next) => {
      try {
        // ete login exac e, userId -n arden req-i mej ka
        const data = await serviceUsers('getProfile', {userId:+req.userId} );
        res.status(200).json({
          ...data
        })
      } catch (e) {
        next(e)
      }
  };
    static editProfile = async (req, res, next) => {
    try {
      let oldAvatar=null;
      if(req.file && req.fileName){
         const {user} = await serviceUsers('getProfile', {userId:+req.userId} );
         oldAvatar=user['avatar'] || null;

         const destinationFilename= `users/user_${req.userId}_${req.fileName}`;
         await GCS.upload(BUCKET_NAME, req.file, destinationFilename );

         const avatar = path.join(GCS_BASE_URL, BUCKET_NAME,  destinationFilename);
         req.body.avatar=avatar;
      }
      const data = await serviceUsers('editProfile', {...req.body, userId:+req.userId} );
      if(data && oldAvatar){
          setImmediate(()=> GCS.delete(BUCKET_NAME, `users/${oldAvatar.split('/')[4]}` ));
      }

      res.status(201).json({
          ...data
      })
    } catch (e) {
      next(e)
    }
  };

    // ==== DELETE PROFILE SHOULD BE DONE ==== //
  //   static deleteProfile = async (req, res, next) => {
  //   try {
  //     res.status(204).json({
  //       ...data
  //     })
  //   } catch (e) {
  //     next(e)
  //   }
  // };
}

export default UsersController;