const express = require('express');
const router = express.Router();
const userControl = require('../controller/controller');
const { validationUpdate, validationSchema, validationLogin } = require('../middleware/validation');

router.route('/')
    .get(userControl.getAllUsers)
    .post(validationSchema(), userControl.addUser);
router.route('/username/:username')
    .get(userControl.getSingleUserByUserName);
router.route('/:userid')
    .get(userControl.getSingleUserById)
    .patch(validationUpdate(), userControl.updateUser)
    .delete(userControl.deleteUser);
router.route('/login')
    .post(validationLogin(), userControl.loginUser);
module.exports = router;