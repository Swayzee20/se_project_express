const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { NotFoundError } = require("../errors/not-found-error");
const { BadRequestError } = require("../errors/bad-request-error");
const { UnauthorizedError } = require("../errors/unauthorized-error");
const { ConflictError } = require("../errors/confilct-error");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(() => res.send({ name, avatar, email }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        // return res
        //   .status(ALREADY_EXISTS)
        //   .send({ message: "Email already exists" });
        return next(new ConflictError("Email already exists"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: err.message });
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
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
        return next(
          new BadRequestError("Illegal arguments: undefined, string"),
        );
      }
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
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
        return next(new BadRequestError(err.message));
      }
      return next(err);
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
