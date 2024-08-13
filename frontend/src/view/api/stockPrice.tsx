// src/components/StockPrice.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Layout, Card, Typography, Row, Col, Table, message } from 'antd';
import { getEquityData } from './apiClient';
import { EquityResponse } from './types';


const { Content } = Layout;
const { Title } = Typography;

interface EquityData {
  stck_shrn_iscd: string;
  stck_prpr: number;
  prdy_vrss: number;
  prdy_ctrt: number;
  prdy_vrss_sign: string;
  per: number;
  eps: number;
  pbr: number;
  bps: number;
}

const StockPrice: React.FC = () =>  {
    const { id } = useParams<{ id: string }>();
//   const [equity, setEquity] = useState<EquityData | null>(null);

  const [equity, setEquity] = useState<EquityResponse | null>(null);
  const [jobDate, setJobDate] = useState<string>('');

    useEffect(() => {
    const fetchData = async () => {
        if (id) {
            try {
              const data = await getEquityData(id);
              setEquity(data);
              setJobDate(new Date().toLocaleString());
            } catch (error) {
              message.error('Failed to fetch equity data');
            }
        }
    };

    fetchData();
  }, [id]);

  if (!equity) {
    return <div>Loading...</div>;
  }
  

  const getColor = (sign: string) => {
    if (sign < '3') return 'red';
    if (sign > '3') return 'blue';
    return 'black';
  };

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }
  ];

  const data = equity ? [
    { key: '1', metric: 'PER', value: equity.output.per },
    { key: '2', metric: 'EPS', value: equity.output.eps },
    { key: '3', metric: 'PBR', value: equity.output.pbr },
    { key: '4', metric: 'BPS', value: equity.output.bps }
  ] : [];

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Title level={4}>조회시간: {jobDate}</Title>
        </div>
        {equity && (
          <>
            <Card title={equity.output.stck_shrn_iscd} bordered={false}>
              <div>
                <Title level={1}>{equity.output.stck_prpr}원</Title>
                <span style={{ color: getColor(equity.output.prdy_vrss_sign) }}>
                  {equity.output.prdy_vrss}
                </span>
                <span style={{ color: getColor(equity.output.prdy_vrss_sign) }}>
                  {equity.output.prdy_ctrt}
                </span>
              </div>
            </Card>
            <Card bordered={false} style={{ marginTop: '16px' }}>
              <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false} 
              />
            </Card>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default StockPrice;
