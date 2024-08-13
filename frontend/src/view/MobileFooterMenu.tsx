import React from 'react';
import { Menu } from 'antd';
import { WalletOutlined, BookOutlined, TransactionOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './style/MobileFooterMenu.css';

const MobileFooterMenu = () => {
  const location = useLocation();
  const selectedKey = location.pathname;

  return (
    <div className="mobile-footer-menu">
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        style={{ display: 'flex', justifyContent: 'space-around' }}
      >
        <Menu.Item key="/assets" icon={<WalletOutlined />}>
          <Link to="/assets">자산</Link>
        </Menu.Item>
        <Menu.Item key="/transactions" icon={<BookOutlined />}>
          <Link to="/transactions">거래내역</Link>
        </Menu.Item>
        <Menu.Item key="/transfer" icon={<TransactionOutlined />}>
          <Link to="/transfer">계좌 이체</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default MobileFooterMenu;
