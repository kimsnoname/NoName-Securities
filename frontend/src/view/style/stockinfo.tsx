// stockinfo.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './style/stockinfo.css';

interface StockData {
  stockEndType: string;
  itemCode: string;
  reutersCode: string;
  stockName: string;
  totalInfos: Array<{
    code: string;
    key: string;
    value: string;
    compareToPreviousPrice?: {
      code: string;
      text: string;
      name: string;
    };
  }>;
  dealTrendInfos: Array<{
    itemCode: string;
    bizdate: string;
    foreignerPureBuyQuant: string;
    foreignerHoldRatio: string;
    organPureBuyQuant: string;
    individualPureBuyQuant: string;
    closePrice: string;
    compareToPreviousClosePrice: string;
    compareToPreviousPrice: {
      code: string;
      text: string;
      name: string;
    };
    accumulatedTradingVolume: string;
  }>;
  researches: Array<{
    id: number;
    cd: string;
    nm: string;
    bnm: string;
    tit: string;
    rcnt: string;
    wdt: string;
  }>;
  industryCode: string;
  industryCompareInfo: Array<{
    stockType: string;
    stockEndType: string;
    itemCode: string;
    reutersCode: string;
    stockName: string;
    sosok: string;
    closePrice: string;
    compareToPreviousClosePrice: string;
    compareToPreviousPrice: {
      code: string;
      text: string;
      name: string;
    };
    fluctuationsRatio: string;
    marketValue: string;
    stockExchangeType: {
      code: string;
      zoneId: string;
      nationType: string;
      delayTime: number;
      startTime: string;
      endTime: string;
      closePriceSendTime: string;
      nameKor: string;
      nameEng: string;
      stockType: string;
      nationCode: string;
      nationName: string;
      name: string;
    };
    endUrl: string;
  }>;
  consensusInfo: {
    itemCode: string;
    createDate: string;
    recommMean: string;
    priceTargetMean: string;
  };
  shareholdersMeetingInfo: any;
  irScheduleInfo: any;
}

const StockInfoComponent: React.FC = () => {
  const { stockCode } = useParams<{ stockCode: string }>();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5002/proxy/stock/${stockCode}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: StockData = await response.json();
        setStockData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stockCode]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  if (!stockData) {
    return <div>No stock information available</div>;
  }

  return (
    <div className="stock-info-container">
      <h3>{stockData.stockName}</h3>
      <ul>
        {stockData.totalInfos.map((info) => (
          <li key={info.code}>
            {info.key}: {info.value} {info.compareToPreviousPrice && `(${info.compareToPreviousPrice.text})`}
          </li>
        ))}
      </ul>
      <h4>Deal Trends</h4>
      <ul>
        {stockData.dealTrendInfos.map((deal, index) => (
          <li key={index}>
            Date: {deal.bizdate}, Foreigner Buy: {deal.foreignerPureBuyQuant}, Org Buy: {deal.organPureBuyQuant}, Individual Buy: {deal.individualPureBuyQuant}, Close Price: {deal.closePrice} ({deal.compareToPreviousPrice.text})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockInfoComponent;
