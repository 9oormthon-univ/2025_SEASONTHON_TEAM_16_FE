import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import {
  getPostDetail,
  getComments,
  createComment,
  toggleScrap,
  toggleLike,
  editComment,
  deleteComment,
} from "../../api/post";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // 수정 상태 관리
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const fetchDetail = useCallback(async () => {
    try {
      const data = await getPostDetail(postId);
      setPost(data);

      const commentData = await getComments(postId);
      setComments(commentData?.content || []);
    } catch (err) {
      console.error("게시글 상세 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 댓글 등록
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment(postId, newComment);
      setNewComment("");
      await fetchDetail();
    } catch (err) {
      alert("댓글 등록 실패");
    }
  };

  // 댓글 수정
  const handleEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      await editComment(commentId, editingContent);
      setEditingCommentId(null);
      setEditingContent("");
      await fetchDetail();
    } catch (err) {
      alert("댓글 수정 실패");
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      await fetchDetail();
    } catch (err) {
      alert("댓글 삭제 실패");
    }
  };

  // 좋아요
  const handleLikeToggle = async () => {
    try {
      await toggleLike(postId);
      setPost((prev) => ({
        ...prev,
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      }));
    } catch (err) {
      alert("좋아요 실패");
    }
  };

  // 스크랩
  const handleScrapToggle = async () => {
    try {
      await toggleScrap(postId);
      setPost((prev) => ({ ...prev, isScraped: !prev.isScraped }));
    } catch (err) {
      alert("스크랩 실패");
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (!post) return <p>데이터 없음</p>;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: "url(/assets/images/bg_home.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Header />
      <main className={styles.mainContent}>
        {/* 작성자 */}
        <div className={styles.authorBox}>
          <span className={styles.author}>{post.createdByNickname}</span>
        </div>

        {/* 게시글 카드 */}
        <div className={styles.postCard}>
          <div className={styles.postHeader}>
            <h2 className={styles.title}>{post.title}</h2>
            <img
              src={
                post.isScraped
                  ? "/assets/icons/clicked_bookmark.svg"
                  : "/assets/icons/bookmark.svg"
              }
              alt="스크랩"
              className={styles.scrapIcon}
              onClick={handleScrapToggle}
            />
          </div>

          <p className={styles.info}>
            {post.bookTitle} / {post.author}
          </p>
          <p className={styles.quote}>{post.quote}</p>
        </div>

        {/* 좋아요 + 댓글 수 */}
        <div className={styles.meta}>
          <span className={styles.metainfo} onClick={handleLikeToggle}>
            <img
              src={
                post.isLiked
                  ? "/assets/icons/clicked_like.svg"
                  : "/assets/icons/like.svg"
              }
              alt="좋아요"
            />{" "}
            {post.likeCount}
          </span>
          <span className={styles.metainfo}>
            <img src="/assets/icons/comment.svg" alt="댓글" /> {comments.length}
          </span>
        </div>

        {/* 댓글 리스트 */}
        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.commentUser}>{c.authorNickname}</span>

                {c.isOwner && (
                  <p className={styles.mode}>
                    {editingCommentId === c.id ? (
                      <>
                        <span
                          className={styles.button}
                          onClick={() => handleEditSubmit(c.id)}
                        >
                          저장
                        </span>
                        <span
                          className={styles.button}
                          onClick={() => setEditingCommentId(null)}
                        >
                          취소
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className={styles.button}
                          onClick={() => handleEdit(c)}
                        >
                          수정
                        </span>
                        <span
                          className={styles.button}
                          onClick={() => handleDelete(c.id)}
                        >
                          삭제
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>

              {editingCommentId === c.id ? (
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className={styles.commentInput}
                />
              ) : (
                <p className={styles.commentContent}>{c.content}</p>
              )}
            </li>
          ))}
        </ul>

        {/* 댓글 입력 */}
        <div className={styles.commentInputBox}>
          <input
            type="text"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.commentInput}
          />
          <button
            onClick={handleCommentSubmit}
            className={styles.commentButton}
          >
            등록
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailPage;
