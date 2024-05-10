const router = require('express').Router();
const isValidUser = require('../middleware/isValidUser')
const userController = require('../controllers/userController')

router.route('/')
.get(isValidUser, userController.getUsers)

router.route('/signup')
.post( userController.addUser);

router.route('/login')
.post( userController.loginUser);

// router.route('/:id')
// .get( postController.getPost)
// .patch( postController.updatePost)
// .delete( postController.deletePost);

module.exports = router;