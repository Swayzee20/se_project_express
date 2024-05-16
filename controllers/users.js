const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NotFoundError } = require("../errors/not-found-error");
const { BadRequestError } = require("../errors/bad-request-error");
const { UnauthorizedError } = require("../errors/unauthorized-error");
const { ConflictError } = require("../errors/confilct-error");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  ALREADY_EXISTS,
  INVALID_DATA,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.send({ name, avatar, email }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      if (err.code === 11000) {
        // return res
        //   .status(ALREADY_EXISTS)
        //   .send({ message: "Email already exists" });
        next(new ConflictError("Email already exists"));
        return;
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: err.message });
        next(new NotFoundError("User not found"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      next(err);
      return;
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token, name: user.name, avatar: user.avatar, id: user._id });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Illegal arguments: undefined, string") {
        next(new BadRequestError("Illegal arguments: undefined, string"));
        return;
      }
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
        return;
      }
      next(err);
      return;
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      const { name, avatar, email, _id } = user;
      res.send({ name, avatar, email, _id });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      next(err);
      return;
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate(
    { _id: userId },
    { name, avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        // return res.status(BAD_REQUEST).send({ message: err.message });
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
      return;
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateProfile,
};
