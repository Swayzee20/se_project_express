const router = require("express").Router();
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

module.exports = router;
