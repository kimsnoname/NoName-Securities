import React from 'react';
import './style/Footer.css';

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-background">
        <div className="pink-background"></div>
        <div className="blue-background"></div>
      </div>
      <div className="footer-content">
        <div className="left-text">
          <span className="desktop-only">서울특별시 영등포구 의사당대로 1  (무명증권스퀘어) | 대표이사 정성욱 | </span>
          <span className="mobile-only">서울특별시 영등포구 의사당대로 1  (무명증권스퀘어) | 대표이사 정성욱 |</span>
        </div>
        <div className="contact-text">고객센터 1588-9000</div>
      </div>
    </div>
  );
};

export default Footer;
