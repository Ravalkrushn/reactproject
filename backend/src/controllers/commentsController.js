import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { productId, productName, userId, userName, text } = req.body;

    if (!productId || !productName || !userName || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const comment = new Comment({
      productId,
      productName,
      userId,
      userName,
      text,
    });

    await comment.save();

    return res.json({ success: true, comment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCommentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await Comment.find({ productId }).sort({ createdAt: -1 });

    return res.json({ success: true, comments });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
