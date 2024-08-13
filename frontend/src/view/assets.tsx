import React, { useState, useEffect } from 'react';
import SidebarLayout from './SidebarLayout';
import './style/assets.css';
import PieChart from './js/PieChart'; // 차트 컴포넌트를 임포트합니다

const Assets = () => {
  const [selectedKey, setSelectedKey] = useState('2');

  const [domesticStock, setDomesticStock] = useState({ profitLoss: -22020, amount: 1129260 });
  const [foreignStock, setForeignStock] = useState({ profitLoss: 353379, amount: 12285756 });
  const [cashBalance, setCashBalance] = useState({ profitLoss: 0, amount: 444694 });
  const isMobile = window.innerWidth <= 768;
  const [stocks, setStocks] = useState([
    { name: '종목1', profitLoss: -1520, profitRate: -0.97, amount: 155760, investedAmount: 157280 },
    { name: '테슬라', profitLoss: 353379, profitRate: 37.90, amount: 1285756, investedAmount: 932377 },
    { name: '한전', profitLoss: -20500, profitRate: -2.06, amount: 973500, investedAmount: 994000 },
  ]);

  // 총 자산 계산
  const totalAssets = domesticStock.amount + foreignStock.amount + cashBalance.amount;

  // 투자금액 및 평가손익 계산
  const investedAmount = stocks.reduce((sum, stock) => sum + stock.investedAmount, 0);
  const evaluationProfitLoss = stocks.reduce((sum, stock) => sum + stock.profitLoss, 0);

  // 수익률 계산
  const profitRate = ((evaluationProfitLoss / investedAmount) * 100).toFixed(2) + '%';

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
  };

  // 차트 데이터 업데이트
  const chartData = [
    { name: '국내주식', value: domesticStock.amount },
    { name: '해외주식', value: foreignStock.amount },
    { name: '현금잔고(예수금)', value: cashBalance.amount }
  ];

  return (
    <>
    {!isMobile ? (
    <div className="desktop-container">
    <SidebarLayout selectedKey={selectedKey} onMenuClick={handleMenuClick}>
      <div className='assets_parent-wrapper'>
        <div className="assets_wrapper_1">
          <div>자산 (평가금액)</div>
          <div className="right-align">{totalAssets.toLocaleString()}원</div>
          <div>투자금액</div>
          <div className="right-align">{investedAmount.toLocaleString()}원</div>
          <div>평가손익</div>
          <div className={`right-align ${evaluationProfitLoss < 0 ? 'assets_negative' : 'assets_positive'}`}>{evaluationProfitLoss.toLocaleString()}원</div>
          <div>수익률</div>
          <div className={`right-align ${profitRate.includes('-') ? 'assets_negative' : 'assets_positive'}`}>{profitRate}</div>
        </div>
        <div className="assets_wrapper_2">
          <div className="assets_wrapper_2-left">
            <PieChart data={chartData} />
          </div>
          <div className="assets_wrapper_2-right">
            <table className="assets_table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>평가손익(원)</th>
                  <th>평가금액(원)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>국내주식</td>
                  <td className={domesticStock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{domesticStock.profitLoss.toLocaleString()}원</td>
                  <td>{domesticStock.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>현금잔고(예수금)</td>
                  <td className={cashBalance.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{cashBalance.profitLoss.toLocaleString()}원</td>
                  <td>{cashBalance.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>해외주식</td>
                  <td className={foreignStock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{foreignStock.profitLoss.toLocaleString()}원</td>
                  <td>{foreignStock.amount.toLocaleString()}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="stocks-section">
          <h2>종목별 현황</h2>
          {stocks.map((stock, index) => (
            <div key={index} className="stock-item">
              <span>{stock.name}</span>
              <div>
                <span className={stock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{stock.profitLoss.toLocaleString()}원</span>
                <span className={stock.profitRate < 0 ? 'assets_negative' : 'assets_positive'}>{stock.profitRate}%</span>
              </div>
              <div>
                <span className="right-align">{stock.amount.toLocaleString()}원</span>
                <span className="right-align">{stock.investedAmount.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
    </div>
    ) : (
      <div className="mobile-container">
        <div className='assets_parent-wrapper'>
        <div className="assets_wrapper_1">
          <div>자산 (평가금액)</div>
          <div className="right-align">{totalAssets.toLocaleString()}원</div>
          <div>투자금액</div>
          <div className="right-align">{investedAmount.toLocaleString()}원</div>
          <div>평가손익</div>
          <div className={`right-align ${evaluationProfitLoss < 0 ? 'assets_negative' : 'assets_positive'}`}>{evaluationProfitLoss.toLocaleString()}원</div>
          <div>수익률</div>
          <div className={`right-align ${profitRate.includes('-') ? 'assets_negative' : 'assets_positive'}`}>{profitRate}</div>
        </div>
        <div className="assets_wrapper_2">
          <div className="assets_wrapper_2-left">
            <PieChart data={chartData} />
          </div>
          <div className="assets_wrapper_2-right">
            <table className="assets_table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>평가손익(원)</th>
                  <th>평가금액(원)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>국내주식</td>
                  <td className={domesticStock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{domesticStock.profitLoss.toLocaleString()}원</td>
                  <td>{domesticStock.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>현금잔고(예수금)</td>
                  <td className={cashBalance.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{cashBalance.profitLoss.toLocaleString()}원</td>
                  <td>{cashBalance.amount.toLocaleString()}원</td>
                </tr>
                <tr>
                  <td>해외주식</td>
                  <td className={foreignStock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{foreignStock.profitLoss.toLocaleString()}원</td>
                  <td>{foreignStock.amount.toLocaleString()}원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="stocks-section">
          <h2>종목별 현황</h2>
          {stocks.map((stock, index) => (
            <div key={index} className="stock-item">
              <span>{stock.name}</span>
              <div>
                <span className={stock.profitLoss < 0 ? 'assets_negative' : 'assets_positive'}>{stock.profitLoss.toLocaleString()}원</span>
                <span className={stock.profitRate < 0 ? 'assets_negative' : 'assets_positive'}>{stock.profitRate}%</span>
              </div>
              <div>
                <span className="right-align">{stock.amount.toLocaleString()}원</span>
                <span className="right-align">{stock.investedAmount.toLocaleString()}원</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    )
  }
    </>
  );
};

export default Assets;
