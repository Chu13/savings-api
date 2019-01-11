const User = require('../models/user');
const Errors = require("../models/errors")

exports.createUser = async function (raw_user) {
   try {
       await UserFB.create(raw_user)
   } catch (error) {
       if (error.code === 11000) {
           let count = await User.count({"email": raw_user.email})
           if (count) {
               throw new Errors.UserAlreadyRegisteredError();
           }
       } else {
           throw {message: "Unhandled Error", details: error}
       }
   }
}