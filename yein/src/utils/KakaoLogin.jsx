import '../css/KakaoLogin.css';
import logo from '../assets/kakaotalk-seeklogo.png';

const KakaoLogin = () => {
    const REST_API_KEY = 'b12aba70ea0539f90db44279030341b6';
    const REDIRECT_URI = 
        window.location.hostname === "localhost"
        ? 'http://localhost:5173/oidc-callback'
        : 'https://yein-frontend.vercel.app/oidc-callback';
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const loginHandler = () => {
        window.location.href = link;
    };

    return (
        <button type="button" className="kakao-icon-btn" onClick={loginHandler} style={{backgroundImage: `url(${logo})`}}/>
    );
};

export default KakaoLogin;