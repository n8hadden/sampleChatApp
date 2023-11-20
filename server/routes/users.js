const mongoose = require('mongoose');
const router = require('express').Router();

// const authMiddleware = require('../middleware/authMiddleware');
// router.use(authMiddleware);

// Import Models
const userSchema = require('../models/User');
const chatSchema = require('../models/Chat');
const messageSchema = require('../models/Message');

// GET User by Id
router.route("/:userId").get(async (req, res, next) => {
    const { userId } = req.params;

    await userSchema
      .findById(userId, "_id username")
      .then((user) => {
        res.json({ user });
      })
      .catch((error) => {
        console.log("Contacts Error " + error);
        return next(error);
      });
});

// GET User Contacts
router.route("/:userId/contacts").get(async (req, res, next) => {
    const { userId } = req.params;

    await userSchema
      .find({ _id: { $ne: userId } }, "_id username")
      .then((users) => {
        res.json({ users });
      })
      .catch((error) => {
        console.log("Contacts Error " + error);
        return next(error);
      });
});

// GET Messages