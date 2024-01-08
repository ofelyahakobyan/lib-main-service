import express from 'express';

import UsersController from '../controllers/usersController';
import validate from '../middlewares/validate';
import users from '../schemas/users';
import uploader from '../middlewares/avatarUploader';
import authorization from '../middlewares/authorization';

const router = express.Router();

const {registration, login, passwordForgot, passwordReset, edit} = users;

/* GET home page. */
router.get('/', UsersController.list);
router.post('/signup', validate(registration),  UsersController.registration);
router.post('/login', validate(login),  UsersController.login);
router.post('/password-forgot', validate(passwordForgot),  UsersController.passwordForgot);
router.post('/password-reset', validate(passwordReset),  UsersController.passwordReset);
router.get('/profile',  authorization('login'), UsersController.getProfile );
router.patch('/profile', uploader, validate(edit), UsersController.editProfile);


export default router;
