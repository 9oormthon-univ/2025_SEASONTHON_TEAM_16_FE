import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PostCreatePage.module.css"; // ✅ 동일한 CSS 재사용
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getPostDetail, updatePost } from "../../api/post";

const PostEditPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    quote: "",
    bookTitle: "",
    author: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPostDetail(postId);
        setForm({
          title: data.title,
          quote: data.quote,
          bookTitle: data.bookTitle,
          author: data.author,
        });
        if (data.imageUrl) setPreview(data.imageUrl);
      } catch (err) {
        alert("게시글 불러오기 실패");
      }
    })();
  }, [postId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      await updatePost(postId, form, image);
      navigate("/community");
    } catch (err) {
      alert("수정 실패");
    }
  };

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
        {/* 제목 */}
        <div className={styles.fieldBox}>
          <label className={styles.label}>제목 :</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* 내용 + 사진 */}
        <div className={styles.fieldBoxContent}>
          <label className={styles.label}>내용 :</label>
          <textarea
            name="quote"
            value={form.quote}
            onChange={handleChange}
            className={styles.textarea}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <img
            src="/assets/icons/picture.svg"
            alt="사진 업로드"
            className={styles.icon}
            onClick={() => fileInputRef.current.click()}
          />

          {preview && (
            <div className={styles.previewWrapper}>
              <img src={preview} alt="미리보기" className={styles.previewImg} />
            </div>
          )}
        </div>

        {/* 책 이름 */}
        <div className={styles.fieldBox}>
          <label className={styles.label}>책 이름 :</label>
          <input
            type="text"
            name="bookTitle"
            value={form.bookTitle}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* 책 저자 */}
        <div className={styles.fieldBox}>
          <label className={styles.label}>책 저자 :</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        {/* 완료 버튼 */}
        <button onClick={handleSubmit} className={styles.button}>
          완료
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default PostEditPage;
