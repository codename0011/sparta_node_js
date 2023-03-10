const express = require("express");
const { Comment } = require("../schemas");
const router = express.Router();

/**
 * 댓글 목록 조회 API
 */
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;
  const result = await Comment.find().where("postId").equals(postId).lean();
  res.json(result);
});

/**
 * 댓글 작성 API
 * - 댓글 내용을 비워둔 채 댓글 작성 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 작성 API를 호출한 경우 작성한 댓글을 추가하기
 */
router.post("/", async (req, res) => {
  const { author, password, content, postId } = req.body;
  if (!content) {
    return res.json({
      success: false,
      message: "댓글 내용을 입력해주세요.",
    });
  }
  const passwordHash = hashUtil.hashPassword(password);
  const comment = new Comment({
    author,
    password: passwordHash,
    content,
    postId,
  });
  await comment.save();
  res.json({
    message: "성공",
  });
});

/**
 * 댓글 수정 API
 * - 댓글 내용을 비워둔 채 댓글 수정 API를 호출하면 "댓글 내용을 입력해주세요" 라는 메세지를 return하기
 * - 댓글 내용을 입력하고 댓글 수정 API를 호출한 경우 작성한 댓글을 수정하기
 */
router.put("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password, content } = req.body;
  if (!content) {
    return res.json({
      success: false,
      message: "댓글 내용을 입력해주세요.",
    });
  }
  const comment = await Comment.findById(commentId).lean();
  if (!comment) {
    return res.json({
      message: "없음",
    });
  }
  if (!hashUtil.comparePassword(password, comment.password)) {
    return res.json({
      message: "일치 안함",
    });
  }
  await Comment.findByIdAndUpdate(commentId, {
    $set: { content: content },
  }).lean();
  return res.json({
    message: "성공",
  });
});
/**
 * 댓글 삭제 API
 */
router.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;
  const comment = await Comment.findById(commentId).lean();
  if (!comment) {
    return res.json({
      message: "없음",
    });
  }
  if (!hashUtil.comparePassword(password, comment.password)) {
    return res.json({
      message: "일치 안함",
    });
  }
  await Comment.findByIdAndDelete(commentId).lean();
  res.json({
    message: "성공",
  });
});

module.exports = router;