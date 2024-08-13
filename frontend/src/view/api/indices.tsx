// src/components/indices.tsx
import React, { useEffect, useState } from 'react';
import { Layout, Card, Table } from 'antd';
import axios from 'axios';

const { Content } = Layout;

interface IndexData {
  output1: {
    hts_kor_isnm: string;
    bstp_nmix_prpr: string;
    bstp_nmix_prdy_vrss: string;
    bstp_nmix_prdy_ctrt: string;
    prdy_vrss_sign: string;
  };
}

const Indices: React.FC = () => {
  const [indicesKor, setIndicesKor] = useState<IndexData[]>([]);
  const [jobDate, setJobDate] = useState<string>('');

  useEffect(() => {
    // Replace the URL with the appropriate API endpoint
    axios.get('/api/kisd/indices')
      .then(response => {
        setIndicesKor(response.data.indicesKor);
        setJobDate(response.data.jobDate);
      })
      .catch(error => {
        console.error('Error fetching index data:', error);
      });
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'hts_kor_isnm',
      key: 'hts_kor_isnm',
      render: (_: any, record: IndexData) => record.output1.hts_kor_isnm
    },
    {
      title: 'Price',
      dataIndex: 'bstp_nmix_prpr',
      key: 'bstp_nmix_prpr',
      render: (_: any, record: IndexData) => record.output1.bstp_nmix_prpr
    },
    {
      title: 'Change',
      dataIndex: 'bstp_nmix_prdy_vrss',
      key: 'bstp_nmix_prdy_vrss',
      render: (_: any, record: IndexData) => (
        <span style={{ color: getColor(record.output1.prdy_vrss_sign) }}>
          {record.output1.bstp_nmix_prdy_vrss}
        </span>
      )
    },
    {
      title: 'Change Rate',
      dataIndex: 'bstp_nmix_prdy_ctrt',
      key: 'bstp_nmix_prdy_ctrt',
      render: (_: any, record: IndexData) => (
        <span style={{ color: getColor(record.output1.prdy_vrss_sign) }}>
          {record.output1.bstp_nmix_prdy_ctrt}
        </span>
      )
    }
  ];

  const getColor = (sign: string) => {
    if (sign < '3') return 'red';
    if (sign > '3') return 'blue';
    return 'black';
  };

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Card title="국내 지수" bordered={false}>
          <div style={{ marginBottom: '16px' }}>
            <span>조회시간: {jobDate}</span>
          </div>
          <Table 
            columns={columns} 
            dataSource={indicesKor} 
            rowKey={record => record.output1.hts_kor_isnm}
            pagination={false} 
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default Indices;
