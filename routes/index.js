const router = require("express").Router();
const { BAD_REQUEST, NOT_FOUND, DEFAULT } = require("../utils/errors");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.use("*", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
