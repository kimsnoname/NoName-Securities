import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './style/StockInfo.css';

interface TotalInfo {
  code: string;
  key: string;
  value: string;
}

interface DealTrendInfo {
  bizdate: string;
  closePrice: string;
  accumulatedTradingVolume: string;
  compareToPreviousClosePrice: string;
}

interface Research {
  id: number;
  tit: string;
  bnm: string;
}

interface StockInfoData {
  stockName: string;
  itemCode: string;
  totalInfos: TotalInfo[];
  dealTrendInfos: DealTrendInfo[];
  researches: Research[];
  consensusInfo: {
    createDate: string;
    priceTargetMean: string;
    recommMean: string;
  };
  industryCompareInfo: {
    itemCode: string;
    stockName: string;
    closePrice: string;
    fluctuationsRatio: string;
    endUrl: string;
  }[];
  irScheduleInfo: {
    irScheduleDate: string;
    irScheduleDday: number;
    title: string;
  };
}

const StockInfoComponent: React.FC = () => {
  const { stockCode } = useParams<{ stockCode: string }>();
  const [stockInfo, setStockInfo] = useState<StockInfoData | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    if (stockCode) {
      axios.get(`http://43.202.240.147:8080/stock/data/${stockCode}`)
        .then(response => {
          setStockInfo(response.data);
          setStockError(null);
        })
        .catch(error => {
          setStockError(error.message);
        });

      axios.get(`http://43.202.240.147:8080/fetchLogo?stockCode=${stockCode}`)
        .then(response => {
          setLogoUrl(response.data);
          setLogoError(null);
        })
        .catch(error => {
          setLogoError(error.message);
        });
    }
  }, [stockCode]);

  if (stockError) return <div className="error">Stock Data Error: {stockError}</div>;

  return (
    <div className="stock-info">
      <h1>
        {logoUrl && <img src={logoUrl} alt="Company Logo" className="company-logo" />}
        {logoError && <div className="error">Logo Error: {logoError}</div>}
        {stockInfo?.stockName} ({stockInfo?.itemCode})
      </h1>

      {stockInfo && (
        <>
          <div className="info-section">
            <h2>기본 정보</h2>
            <ul>
              {stockInfo.totalInfos && stockInfo.totalInfos.map(info => (
                <li key={info.code}>{info.key}: {info.value}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>거래 정보</h2>
            <ul>
              {stockInfo.dealTrendInfos && stockInfo.dealTrendInfos.map(info => (
                <li key={info.bizdate}>날짜: {info.bizdate}, 가격: {info.closePrice}, 거래량: {info.accumulatedTradingVolume}</li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>상세 정보</h2>
            <ul>
              {stockInfo.researches && stockInfo.researches.map(research => (
                <li key={research.id}>
                  <a href={`https://m.stock.naver.com/domestic/stock/${stockCode}/research/${research.id}`} target="_blank" rel="noopener noreferrer">
                    {research.tit} ({research.bnm})
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-section">
            <h2>컨센서스 정보</h2>
            <div>
              생성일: {stockInfo.consensusInfo.createDate}, 목표가 평균: {stockInfo.consensusInfo.priceTargetMean}, 추천 평균: {stockInfo.consensusInfo.recommMean}
            </div>
          </div>

          <div className="info-section">
            <h2>산업 비교 정보</h2>
            <ul>
              {stockInfo.industryCompareInfo && stockInfo.industryCompareInfo.map(info => (
                <li key={info.itemCode}>
                  <a href={info.endUrl} target="_blank" rel="noopener noreferrer">{info.stockName} (종가: {info.closePrice}, 변동률: {info.fluctuationsRatio}%)</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ir-schedule">
            <h2>IR 일정</h2>
            <div>
              일정: {stockInfo.irScheduleInfo.title}, 날짜: {stockInfo.irScheduleInfo.irScheduleDate} (D-{stockInfo.irScheduleInfo.irScheduleDday})
            </div>
          </div>
        </>
      )}

      {!stockInfo && !stockError && <div className="loading">Loading...</div>}
    </div>
  );
}

export default StockInfoComponent;
