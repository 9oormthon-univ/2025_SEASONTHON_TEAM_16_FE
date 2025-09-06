import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동용
import styles from "./PostCreatePage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { createPost } from "../../api/post";

const PostCreatePage = () => {
  const [form, setForm] = useState({
    title: "",
    quote: "",
    bookTitle: "",
    author: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
    if (!form.title || !form.quote || !form.bookTitle || !form.author) {
      alert("제목, 내용, 책 이름, 저자를 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();

    const payload = {
      title: form.title,
      quote: form.quote,
      bookTitle: form.bookTitle,
      author: form.author,
    };
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      await createPost(formData);
      navigate("/community");
    } catch (err) {
      console.error("게시글 생성 실패:", err);
      alert("등록 실패: " + (err.response?.data?.message || "알 수 없는 오류"));
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

export default PostCreatePage;
