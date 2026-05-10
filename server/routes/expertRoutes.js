const express = require("express");

const {
  getExperts,
  getExpertById,
  getAllExpertsForAdmin,
  getUniqueCategories,
  createExpert,
  updateExpert,
  deleteExpert,
} = require("../controllers/expertController");
const { validateExpertQuery, validateMongoId, validateExpertPayload } = require("../middleware/validateRequest");

const router = express.Router();

router.get("/admin/all", getAllExpertsForAdmin);
router.get("/categories", getUniqueCategories);
router.post("/", validateExpertPayload, createExpert);
router.get("/", validateExpertQuery, getExperts);
router.put("/:id", validateMongoId, validateExpertPayload, updateExpert);
router.delete("/:id", validateMongoId, deleteExpert);
router.get("/:id", validateMongoId, getExpertById);

module.exports = router;
