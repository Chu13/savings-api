const express = require('express');
const router  = express.Router();
const user = require('../controllers/user');

router.route("/user/signup")
  .post(user.validations.signup, user.signup);

router.route("/user/login")
  .get(user.validations.login, user.login);

router.route("/user/refresh")
  .get(user.validations.refresh, user.refresh);

module.exports = router;
