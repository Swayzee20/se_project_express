const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  NOT_AUTHORIZED,
  NotFoundError,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  // const createdAt = Date.now();
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (userId === String(item.owner)) {
        console.log("item found");
        clothingItem
          .deleteOne(item)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            console.error(err);
            if (err.name === "DocumentNotFoundError") {
              return res.status(NOT_FOUND).send({ message: err.message });
            }
            if (err.name === "CastError") {
              return res.status(BAD_REQUEST).send({ message: "Invalid data" });
            }
            return res
              .status(DEFAULT)
              .send({ message: "An error has occured on the server." });
          });
      } else {
        return res
          .status(NOT_AUTHORIZED)
          .send({ message: "Cannot delete item" });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: "item Not Found" });
        next(new NotFoundError("Item was not found"));
        return;
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const addLike = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occured on the server." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
};
