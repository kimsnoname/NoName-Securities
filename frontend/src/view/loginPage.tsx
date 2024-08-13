// src/components/Login.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style/login.css';
import { Button, Form, Input, Checkbox, message } from 'antd';
import axios from 'axios';

interface LoginEntity {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserName: (userName: string | null) => void;
}

declare global {
  interface Window {
    Android: {
      getToken: () => string;
      saveToken: (autoLogin: boolean, token: string, userId: string, userKey: string) => void;
      checkDay: () => void; // 추가된 부분
    };
  }
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUserName }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string | null>(null);

  useEffect(() => {
    if (window.Android && typeof window.Android.getToken === 'function') {
      const tokenData = window.Android.getToken();
      const { autoLogin, token } = JSON.parse(tokenData);

      if (autoLogin && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);

        navigate('/trading');
      }
    } else {
      console.warn('Android getToken function is not available');
    }
  }, [navigate, setIsLoggedIn]);

  const handleSubmit = async (values: LoginEntity) => {
    try {
      const response = await axios.post(`http://43.202.240.147:8080/api/user/login`, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { token, userName, email } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('useremail', email);
        localStorage.setItem('isLoggedIn', 'true');

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          
          if (window.Android && typeof window.Android.saveToken === 'function') {
            // Fetch userId by email
            const userIdResponse = await fetch(`http://43.202.240.147:8080/api/user/getUserIdByEmail?email=${email}`);
            const userIdData = await userIdResponse.json();
            if (userIdData.success) {
              setUserId(userIdData.userId);
              console.log("Fetched userId: ", userIdData.userId);

              // Fetch user key by userId
              const userKeyResponse = await fetch(`http://43.202.240.147:8080/api/user/getUserKeyByUserId?userId=${userIdData.userId}`);
              const userKeyData = await userKeyResponse.json();
              if (userKeyData.success) {
                setUserKey(userKeyData.userKey);
                console.log("Fetched userKey: ", userKeyData.userKey);

                window.Android.saveToken(true, token, userIdData.userId, userKeyData.userKey);

                // Check day if function is available
                if (window.Android && typeof window.Android.checkDay === 'function') {
                  window.Android.checkDay();
                }
              } else {
                console.error("Failed to fetch userKey:", userKeyData.message);
              }
            } else {
              console.error("Failed to fetch userId:", userIdData.message);
            }
          } else {
            console.warn('Android saveToken function is not available');
          }
        } else {
          localStorage.removeItem('rememberMe');
        }

        setIsLoggedIn(true);
        setUserName(userName);
        message.success('로그인 성공');
        navigate('/trading');
      } else {
        message.error('로그인에 실패하였습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('로그인 중 오류가 발생하였습니다.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <Link to="/" className="logo-login">무명증권</Link>
      <h2>로그인</h2>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        className="login-form"
        initialValues={{ email, password, rememberMe }}
      >
        <Form.Item
          label="이메일"
          name="email"
          rules={[
            { required: true, message: '이메일을 입력해주세요.' },
            { type: 'email', message: '올바른 이메일 형식이 아닙니다.' },
          ]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="비밀번호"
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
        >
          <Input.Password
            className="input-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="rememberMe" valuePropName="checked">
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          >
            자동 로그인
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-main-button">
            로그인
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={handleRegisterRedirect} className="register-button-login">
        회원가입
      </Button>
    </div>
  );
};

export default Login;
