const clothingItem = require("../models/clothingItem");
const { NotFoundError } = require("../errors/not-found-error");
const { BadRequestError } = require("../errors/bad-request-error");
const { UnauthorizedError } = require("../errors/unauthorized-error");

const getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
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
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
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
              return next(new NotFoundError("Item not found"));
            }
            if (err.name === "CastError") {
              return next(new BadRequestError("Invalid data"));
            }
            // return res
            //   .status(DEFAULT)
            //   .send({ message: "An error has occured on the server." });
            return next(err);
          });
      } else {
        return next(new UnauthorizedError("Cannot delete item"));
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item was not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
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
        return next(new NotFoundError("Item was not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
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
        return next(new NotFoundError("Item was not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      // return res
      //   .status(DEFAULT)
      //   .send({ message: "An error has occured on the server." });
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
};
