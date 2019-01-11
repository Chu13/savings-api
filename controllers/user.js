const express = require("express");
const config =require("config")
const User = require("../models/user")
const Errors = require("../models/errors");
const UserBusiness = require("../bo/user");
const { checkSchema, validationResult } = require("express-validator/check");
const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");
const authentication = require("../utils/authentication");
let ObjectId = require("mongoose").Types.ObjectId;

let validations = {}

validations.signup = [
    checkSchema({
        email: {isEmail: true},
        name: {isEmpty: {negated: true}, isLength: {options: {min: 1, max: 128}}},
        username: {isEmpty: {negated: true}, isLength: {options: {min: 6,max: 16}}},
        password: {isEmpty: {negated: true}, isLength: {options: {min: 1, max: 128}}},
    })
  ];
exports.signup = async function (req, res) {
    try {
      let errors = validationResult(req).formatWith(Errors.errorFormatter);
      let user = null;
      if (!errors.isEmpty()) {
        console.log(errors.mapped())
        return res.status(400).json({ message: "Wrong parameters", details: errors.mapped() });
      } 
      user = new User()
      user.password = req.body.password
      user.email = req.body.email
      user.name = req.body.name
      user.username = req.body.username
      try {
        await User.create(user)
      } catch (error) {
          if (error.code === 11000) {
              let count = await User.count({"email": user.email})
              if (count) {
                  throw new Errors.UserAlreadyRegisteredError();
              }
          } else {
              throw {message: "Unhandled Error", details: error}
          }
      }
      user.save();
      res.status(200).json({message: "User created", details: user});
    } catch (error) {
      if (error instanceof Errors.UserAlreadyRegisteredError) {
        logger.warn(error.message);
        res.status(409).json(error);
    }else{
        logger.error(error);
        res.status(500).json({ message: "Unhandled error", details: error });
    }
    }
}

validations.login = [authentication.isAuthenticated]
exports.login = async function (req, res) {
      let jwtExpiration =
      new Date().getTime() + config.get("login.tokenDuration");
      let refreshExpiration =
      new Date().getTime() + config.get("login.refreshDuration");
  
  
      var payload = {
          id: req.user.id,
          expires: jwtExpiration,
          refresh: false
      };
      var refreshPayload = {
          id: req.user.id,
          expires: refreshExpiration,
          refresh: true
      };
  
      var token = jwt.sign(payload, authentication.privateJWTServerKey);
      var refreshToken = jwt.sign(refreshPayload, authentication.privateJWTServerKey);
      logger.info("Generating JWT for " + req.user + ": " + token);
  
      res.json({
          jwt: token,
          jwtExpiration: jwtExpiration,
          refreshToken: refreshToken,
          refreshExpiration: refreshExpiration,
      });
}
  
validations.refresh = authentication.hasValidRefreshToken;
exports.refresh = async function(req, res) {
    let now = new Date();
    let jwtExpiration = now.getTime() + config.get("login.tokenDuration");
    let refreshExpiration = now.getTime() + config.get("login.refreshDuration");
    
    var payload = {
      id: req.user.id,
      expires: jwtExpiration,
      refresh: false
    };
    var refreshPayload = {
      id: req.user.id,
      expires: refreshExpiration,
      refresh: true
    };
    
    var token = jwt.sign(payload, "secret");
    var refreshToken = jwt.sign(refreshPayload, "secret");
    logger.info("Generating JWT for " + req.user + ": " + token);
    
    res.json({
      jwt: token,
      jwtExpiration: jwtExpiration,
      refreshToken: refreshToken,
      refreshExpiration: refreshExpiration
    });
};

exports.validations = validations;