const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  NOT_AUTHORIZED,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../utils/errors");

const getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  // const createdAt = Date.now();
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
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
              next(new NotFoundError("Item not found"));
              return;
            }
            if (err.name === "CastError") {
              next(new BadRequestError("Invalid data"));
              return;
            }
            // return res
            //   .status(DEFAULT)
            //   .send({ message: "An error has occured on the server." });
            next(err);
            return;
          });
      } else {
        next(new UnauthorizedError("Cannot delete item"));
        return;
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item was not found"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

const addLike = (req, res, next) => {
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
        next(new NotFoundError("Item was not found"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

const deleteLike = (req, res, next) => {
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
        next(new NotFoundError("Item was not found"));
        return;
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data"));
        return;
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      next(err);
      return;
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
};
