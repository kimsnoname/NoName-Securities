// NotLogin.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './style/NotLogin.css';
import image from './picture/image1.png';

const NotLogin: React.FC = () => {
  return (
    <div className="notlogin-container">
      <img src={image} alt="Login required" className="notlogin-image" />
      <h2>로그인이 필요한 서비스입니다.</h2>
      <Link to="/login">
        <button className="login-button">로그인</button>
      </Link>
    </div>
  );
};

export default NotLogin;
