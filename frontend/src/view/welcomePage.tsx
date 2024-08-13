import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, message } from 'antd';
import './style/welcome.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerEmail } = location.state as { registerEmail: string };
  const [userId, setUserId] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://43.202.240.147:8080/api/user/getUserIdByEmail?email=${registerEmail}`);
        const data = await response.json();
        if (data.success) {
          setUserId(data.userId);
          console.log("Fetched userId: ", data.userId); // 성공 시 userId를 콘솔에 출력

          // Fetch user key by userId
          const keyResponse = await fetch(`http://43.202.240.147:8080/api/user/getUserKeyByUserId?userId=${data.userId}`);
          const keyData = await keyResponse.json();
          if (keyData.success) {
            setUserKey(keyData.userKey);
            console.log("Fetched userKey: ", keyData.userKey); // 성공 시 userKey를 콘솔에 출력

            // Save userId and userKey using mobile function
            if (window.Android && typeof window.Android.setUseridKey === 'function') {
              window.Android.setUseridKey(data.userId, keyData.userKey);
              console.log("Called Android.setUseridKey with: ", data.userId, keyData.userKey);
            } else {
              console.warn('Android setUseridKey function is not available');
            }
          } else {
            message.error('유저 키를 가져오는데 실패했습니다.');
          }
        } else {
          message.error('유저 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('Error fetching userId or userKey:', error);
        message.error('서버와의 통신 중 오류가 발생했습니다.');
      }
    };

    fetchUserId();
  }, [registerEmail]);

  const handleAccountRegister = () => {
    if (userId && userKey) {
      navigate('/accountRegistration', { state: { registerEmail, userId, userKey } });
    } else {
      message.error('유저 정보를 불러오는 중입니다. 잠시만 기다려주세요.');
    }
  };

  return (
    <div className="welcome-container">
      <h2>환영합니다!</h2>
      <h3>아래 버튼을 눌러 계좌를 개설해주세요</h3>
      <Button
        type="primary"
        className="account-register-button"
        onClick={handleAccountRegister}
        disabled={!userId || !userKey}
      >
        계좌 개설하기
      </Button>
    </div>
  );
};

export default Welcome;
