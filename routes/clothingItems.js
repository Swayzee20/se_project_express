const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");

router.get("/", auth, getClothingItems);
router.post("/", auth, createClothingItem);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, addLike);
router.delete("/:itemId/likes", auth, deleteLike);

module.exports = router;
