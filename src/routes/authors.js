import express from 'express';
import AuthorsController from '../controllers/authorsController';
import validate from '../middlewares/validate';
import uploader from '../middlewares/avatarUploader';
import authors from '../schemas/authors';


const router = express.Router();

const {list, add} = authors;

router.get('/',   validate(list), AuthorsController.list);
router.post('/', uploader, validate(add), AuthorsController.add);
// router.patch('/:authorId',  AuthorsController.edit);
// router.delete('/:authorId', AuthorsController.delete);
// router.get('/:authorId', AuthorsController.single);


export default router;
