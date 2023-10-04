var express = require('express');
var router = express.Router();
const usersController = require('../controllers/users.controllers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Users', body:'welcome to users page 🤷‍♂️' });
});

router.route('/register').post(usersController.userRegister);
router.route('/login').post(usersController.userLogin);

module.exports = router;