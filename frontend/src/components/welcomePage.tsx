import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import '../view/style/welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterAccount = () => {
    navigate('/accountRegistration');
  };

  return (
    <div className="welcome-container">
      <h2>환영합니다!</h2>
      <h3>아래 버튼을 눌러 계좌를 개설해주세요</h3>
      <Button type="primary" onClick={handleRegisterAccount}>
        계좌 개설
      </Button>
    </div>
  );
};

export default Welcome;