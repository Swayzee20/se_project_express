const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserLogin, login);
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
