import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';

const ShippingPieChart = () => {
  const [shippingData, setShippingData] = useState([]);

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/shippingpie');
        if (!response.ok) {
          throw new Error('Failed to fetch shipping pie data');
        }
        const data = await response.json();
        setShippingData(data);
      } catch (error) {
        console.error('Error fetching shipping pie data:', error);
      }
    };

    fetchShippingData();
  }, []);

  // Destroy previous chart before rendering a new one
//   useEffect(() => {
//     const canvas = document.getElementById('shippingPieChart');
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, canvas.width, canvas.height);
//   }, [shippingData]);

  const renderPieChart = () => {
    return (
      <Pie
        data={{
          labels: shippingData.map(entry => entry.division),
          datasets: [
            {
              label: 'Orders by Division',
              data: shippingData.map(entry => entry.order_count),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    );
  };

  return (
    <div className='chart-container'>
      
      {shippingData.length > 0 ? renderPieChart() : <p>No data available</p>}
    </div>
  );
};

export default ShippingPieChart;
