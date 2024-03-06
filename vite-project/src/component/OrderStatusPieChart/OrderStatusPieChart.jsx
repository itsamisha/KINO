import React from 'react';
import "./OrderStatusPieChart.css";
import { Pie } from 'react-chartjs-2';

const OrderStatusPieChart = ({ products }) => {
  // Count the occurrences of each order_status
  const orderStatusCount = products.reduce((acc, product) => {
    const status = product.order_status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Extract labels and data for the pie chart
  const labels = Object.keys(orderStatusCount);
  const data = Object.values(orderStatusCount);

  // Define colors for each segment of the pie chart
  const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FFD700']; // Add more colors if needed

  // Prepare data for the Pie component
  const pieChartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
      },
    ],
  };

  return (
    <div className="chart-container">
      
      <Pie data={pieChartData} />
    </div>
  );
};

export default OrderStatusPieChart;
