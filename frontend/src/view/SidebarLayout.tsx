import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, WalletOutlined, BookOutlined, TransactionOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './style/SidebarLayout.css';

const { Sider, Content } = Layout;

const SidebarLayout = ({ selectedKey, onMenuClick, children }) => {
  const menuItems = [
    { key: '1', icon: <UserOutlined />, label: <Link to="/GetMyInfo">내 정보</Link> },
    { key: '2', icon: <WalletOutlined />, label: <Link to="/assets">자산</Link> },
    { key: '3', icon: <BookOutlined />, label: <Link to="/transactions">거래내역</Link> },
    { key: '4', icon: <TransactionOutlined />, label: <Link to="/transfer">계좌 이체</Link> },
  ];

  return (
    <Layout style={{ minHeight: 'calc(100vh - 50px)', marginTop: '50px' }}>
      <Sider width={200} className="site-layout-background sidebar-menu">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={onMenuClick}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px', backgroundColor: 'white' }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: 'white' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
