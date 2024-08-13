import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card } from 'antd';
import './style/transferSuccessPage.css';

const TransferSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToTransfer = () => {
    navigate('/transfer');
  };
  const location = useLocation();
  // const { selectedBankName } = location.state as { selectedBankName: string };
  const { accountNumber } = location.state as { accountNumber: string };
  const { amount } = location.state as { amount: string };

  return (


    <div className="transfer-success-container">
      <h1>이체 완료</h1>
      <div>{accountNumber}로</div>
      <h2>{amount} 원</h2>
      <Button type="primary" className="back-to-transfer-button" onClick={handleBackToTransfer}>
        돌아가기
      </Button>
    </div>

  );
};

export default TransferSuccess;