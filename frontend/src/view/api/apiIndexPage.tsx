// src/Index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';
import NavBar from './NavBar';
import Indices from './indices';
import StockPrice from './stockPrice';



const ApiIndexPage: React.FC = () => {
  return (

      <Layout className="layout">

      <NavBar />

      </Layout>
    
  );
};

export default ApiIndexPage;
