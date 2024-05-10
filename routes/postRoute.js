const router = require('express').Router();
const isValidUser = require('../middleware/isValidUser')
const postController = require('../controllers/postController');

router.route('/')
.get( postController.getPosts)
.post(isValidUser, postController.creatPost);

router.route('/:id')
.get(isValidUser, postController.getPost)
.patch(isValidUser, postController.updatePost)
.delete( isValidUser,postController.deletePost);


module.exports = router;