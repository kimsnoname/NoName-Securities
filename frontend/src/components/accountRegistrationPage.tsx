import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import '../view/style/accountRegistrationPage.css';

const AccountRegistration: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [accountPassword, setAccountPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSendVerificationCode = () => {
    // 핸드폰 번호를 이용해 인증 코드를 전송하는 로직
    // 실제로는 여기에 SMS 전송 등의 로직을 추가해야 합니다.
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCode(generatedCode);
    message.success(`인증 코드가 ${phoneNumber} 번호로 전송되었습니다.`);
  };

  const handleAccountRegistration = () => {
    // 인증 로직: 입력한 인증 코드가 생성된 인증 코드와 일치하는지 확인
    if (verificationCode === '') {
      message.error('먼저 인증 코드를 받아야 합니다.');
      return;
    }

    // 비밀번호가 입력되었는지 확인
    if (accountPassword === '') {
      message.error('계좌 비밀번호를 입력해주세요.');
      return;
    }

    // 인증 성공 시 계좌 개설 로직 추가
    // 예시로 성공 메시지만 출력
    message.success('계좌 개설에 성공하였습니다!');

    // 계좌 개설 후 다른 처리 (예: 홈페이지로 이동)
    navigate('/'); // 예시로 홈페이지로 이동하도록 설정
  };

  return (
    <div className="account-registration-container">
      <h2>계좌 개설</h2>
      <Form className="account-registration-form">
        <Form.Item
          label="핸드폰 번호"
          name="phoneNumber"
          rules={[{ required: true, message: '핸드폰 번호를 입력해주세요.' }]}
        >
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={handleSendVerificationCode}>
            인증 코드 받기
          </Button>
        </Form.Item>
        <Form.Item
          label="인증 코드"
          name="verificationCode"
          rules={[{ required: true, message: '인증 코드를 입력해주세요.' }]}
        >
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="계좌 비밀번호"
          name="accountPassword"
          rules={[{ required: true, message: '계좌 비밀번호를 입력해주세요.' }]}
        >
          <Input.Password
            value={accountPassword}
            onChange={(e) => setAccountPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAccountRegistration}>
            계좌 개설하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountRegistration;
