import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Row, Col } from 'antd';
import '../view/style/testChart.css';
import CandlestickChart from './candlestickChart';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = 'http://localhost:5002';

interface StockData {
    stock_code: string;
    current_price: number;
    low_price: number;
    high_price: number;
    expected_closing_price: number;
    sell_orders: { price: number; quantity: number; }[];
    buy_orders: { price: number; quantity: number; }[];
    volume: number; // 거래량 추가
}

const TestChart = () => {
    const [stockData, setStockData] = useState<StockData | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number | null>(null);

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get<StockData>('http://localhost:5002/stock/000660');
                const calculatedVolume = calculateVolume(response.data); // 거래량 계산
                setStockData({ ...response.data, volume: calculatedVolume });
            } catch (error) {
                console.error('Error fetching stock data:', error);
            }
        };

        fetchStockData();

        // Refresh stock data every 61 seconds
        const interval = setInterval(fetchStockData, 61000);

        return () => clearInterval(interval);
    }, []);

    const calculateVolume = (data: StockData) => {
        // Sell orders의 quantity 합계 계산
        const sellVolume = data.sell_orders.reduce((acc, order) => acc + order.quantity, 0);
        // Buy orders의 quantity 합계 계산
        const buyVolume = data.buy_orders.reduce((acc, order) => acc + order.quantity, 0);
        // 총 거래량 반환
        return sellVolume + buyVolume;
    };

    const handleBuy = () => {
        console.log('Buying at price:', price, 'Quantity:', quantity);
        // Add your buy logic here
    };

    const handleSell = () => {
        console.log('Selling at price:', price, 'Quantity:', quantity);
        // Add your sell logic here
    };

    const handlePriceClick = (selectedPrice: number) => {
        setPrice(selectedPrice);
    };

    if (!stockData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container">
            <div style={{ width: '990px', height: '451px' }}>
                <div className="sub-container-1">
                    <Input
                        placeholder="Stock Code or Name"
                        name="stock-input"
                        value={''} // Input의 value는 stockInput과 같은 state를 사용하도록 수정 필요
                        onChange={() => {}} // onChange도 적절히 처리 필요
                        style={{ width: '200px', height: '44px' }} // height를 44px로 설정
                    />
                </div>
                <div className="sub-container-2">
                    <Row style={{ width: '100%', alignItems: 'center' }}>  {/* alignItems: 'center' 추가 */}
                        <Col span={12}>
                            <div className="price-info">
                                <span>현재가: {stockData.current_price}원</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="other-info">
                                <Row>
                                    <Col span={12}>
                                        <span>저가: {stockData.low_price}원</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>예상체결가: {stockData.expected_closing_price}원</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <span>고가: {stockData.high_price}원</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>거래량: {stockData.volume}주</span>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
                <CandlestickChart />
            </div>
            <div>
                <div className="sub-container-3">
                    <ul className='sell-order'>
                        {stockData.sell_orders.map((order, index) => (
                            <li key={index} onClick={() => handlePriceClick(order.price)}>
                                <span className="price">{order.price}원</span>  <span className="quantity">{order.quantity}주</span>
                            </li>
                        ))}
                    </ul>

                    <ul className='buy-order'>
                        {stockData.buy_orders.map((order, index) => (
                            <li key={index} onClick={() => handlePriceClick(order.price)}>
                                <span className="price">{order.price}원</span>  <span className="quantity">{order.quantity}주</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="sub-container-4">
                    <Row gutter={[16, 16]} className="input-row">
                        <Col span={12}>
                            <Input 
                                placeholder="가격"
                                type="number"
                                value={price !== null ? price : ''}
                                onChange={(e) => setPrice(parseFloat(e.target.value))}
                                style={{ width: '100px' }} // width를 100px로 설정
                            />
                        </Col>
                        <Col span={12}>
                            <Input 
                                placeholder="수량"
                                type="number"
                                value={quantity !== null ? quantity : ''}
                                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                style={{ width: '100px' }} // width를 100px로 설정
                            />
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} className="button-row">
                        <Col span={12}>
                            <Button type="primary" onClick={handleBuy} block>매수</Button>
                        </Col>
                        <Col span={12}>
                            <Button type="danger" onClick={handleSell} block>매도</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default TestChart;
