const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  addLike,
  deleteLike,
} = require("../controllers/clothingItems");
const {
  validateCardBody,
  validateClothingId,
} = require("../middlewares/validation");

router.get("/", getClothingItems);
router.post("/", auth, validateCardBody, createClothingItem);
router.delete("/:itemId", auth, validateClothingId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateClothingId, addLike);
router.delete("/:itemId/likes", auth, validateClothingId, deleteLike);

module.exports = router;
