import express from "express";
import { addComment, getCommentsByProduct } from "../controllers/commentsController.js";

const router = express.Router();

router.post("/add", addComment);
router.get("/:productId", getCommentsByProduct);

export default router;
