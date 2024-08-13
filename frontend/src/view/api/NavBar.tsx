// src/components/NavBar.tsx
import React from 'react';
import { Layout, Menu, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const { Header } = Layout;

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState<string>('');

  const handleSearch = () => {
    if (searchValue) {
      navigate(`/equities/${searchValue}`);
    }
  };

  return (
    <Header>
      <div className="logo">
        <Link to="/" style={{ color: 'white', fontSize: '20px' }}>Noname Stock</Link>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
        <Menu.Item key="1">
          <Link to="/indices">지수</Link>
        </Menu.Item>
      </Menu>
      <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
        <Input
          placeholder="종목코드"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginRight: '10px', width: '200px' }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </Header>
  );
};

export default NavBar;
