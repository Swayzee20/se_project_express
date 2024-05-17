const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { NotFoundError } = require("../errors/not-found-error");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateUserLogin, login);
router.use("*", (req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
