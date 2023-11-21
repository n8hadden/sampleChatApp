// const mongoose = require('mongoose');
const router = require('express').Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// import Models
const userSchema = require("../models/User");
const chatSchema = require('../models/Chat');
const messageSchema = require('../models/Message');

// POST Create User
router.route('/register').post(async (req, res, next) => {

    req.body.password = await bcrypt.hash(req.body.password, 10);

    console.log(req.body);

    await userSchema
      .create(req.body)
      .then((newUser) => {
        const payload = { userId: newUser._id, username: newUser.username };

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expresIn: "1d"
        });

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false
        });


        console.log(`TOKENT ${token}`);
        // Cookie

        res.json({
            user: newUser
        });
      })
      .catch((error) => {
        // console.log(error.message);
        res.json({
            error: error.message
        });

        // console.log("Register Error " + error.message)
        return next(error.message);
      });

    // res.send("register");
});

// Post User Login
router.route("/login").post(async (req, res, next) => {
    const { username, password } = req.body;

    await userSchema
      .findOne({ username: username })
      .then((user) => {
        if (!user) {
            return res
              .status(401)
              .json({ message: "Incorrect username or password" });
        }

        const passwordCorrect = bcrypt.compareSync(req.body.password, user.password);

        // password doesn't match
        if (!passwordCorrect) {
            return res
              .status(401)
              .json({ message: "Incorrect username or password" });
        }

        const payload = { userId: user._id, username: user.username };

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        // console.log(token);

        // cookie
        res.cookie("token", token, {
            withCredentials: true, 
            httpOnly: false
        });

        res.json({ user });
      })
      .catch((error) => {
        console.log("Login Error " + error.message);
        return next(error);
      });

});

// POST User Logout (remove token from cookie)
router.route('/logout').post(async (req, res, next) => {
    res.send("/logout");
});

module.exports = router;