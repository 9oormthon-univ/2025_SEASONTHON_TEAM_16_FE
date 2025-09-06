import { useState } from "react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      await createPost(formData);
      alert("게시글이 등록되었습니다!");
    } catch (err) {
      alert("등록 실패");
    }
  };

  return (
    <div className={styles.postCreate}>
      <Header />
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>게시글 작성</h2>

        <input
          type="text"
          name="title"
          placeholder="제목"
          value={form.title}
          onChange={handleChange}
          className={styles.input}
        />
        <textarea
          name="quote"
          placeholder="내용"
          value={form.quote}
          onChange={handleChange}
          className={styles.textarea}
        />
        <input
          type="text"
          name="bookTitle"
          placeholder="책 이름"
          value={form.bookTitle}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="text"
          name="author"
          placeholder="책 저자"
          value={form.author}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          type="file"
          onChange={handleFileChange}
          className={styles.fileInput}
        />

        <button onClick={handleSubmit} className={styles.button}>
          완료
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default PostCreatePage;
