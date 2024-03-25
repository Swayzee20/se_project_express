const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
