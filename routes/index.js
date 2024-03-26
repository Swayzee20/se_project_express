const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const {
  getUsers,
  createUser,
  getUser,
  login,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", auth, userRouter);
router.use("/items", auth, clothingRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
