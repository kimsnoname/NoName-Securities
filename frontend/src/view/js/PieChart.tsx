// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['국내주식', '해외주식', '현금잔고(예수금)'],
    datasets: [
      {
        label: '자산 분포',
        data: data.length ? data : [1, 1, 1], // 데이터가 없으면 기본적으로 균등 분포로 설정
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
