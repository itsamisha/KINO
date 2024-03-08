import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

const AdminChart = () => {
  // State variables to store the monthly and weekly revenue data
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Function to fetch monthly revenue data
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/monthly-shipping-revenue');
        const data = await response.json();
        setMonthlyRevenue(data);
      } catch (error) {
        console.error('Error fetching monthly revenue data:', error);
        // Handle error if necessary
      }
    };

    // Function to fetch weekly revenue data
    const fetchWeeklyRevenue = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin/weekly-shipping-revenue');
        const data = await response.json();
        setWeeklyRevenue(data);
      } catch (error) {
        console.error('Error fetching weekly revenue data:', error);
        // Handle error if necessary
      }
    };

    // Call the fetch functions
    fetchMonthlyRevenue();
    fetchWeeklyRevenue();
  }, []);

  const monthlyChartData = {
    labels: monthlyRevenue.map(entry => entry.period),
    datasets: [
      {
        
        data: monthlyRevenue.map(entry => entry.total_shipping_revenue), // Assuming each entry in monthlyRevenue has a 'total_shipping_revenue' property
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        barThickness: 100, // Adjust the thickness of the bars
      },
    ],
  };

  const weeklyChartData = {
    labels: weeklyRevenue.map(entry => entry.period),
    datasets: [
      {
        label: 'Weekly Revenue',
        data: weeklyRevenue.map(entry => entry.total_shipping_revenue), // Assuming each entry in weeklyRevenue has a 'total_shipping_revenue' property
        backgroundColor: 'rgba(192,75,192,0.2)',
        borderColor: 'rgba(192,75,192,1)',
        borderWidth: 1,
        barThickness: 100, // Adjust the thickness of the bars
      },
    ],
  };

  const options = {
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Period', // X-axis label
        },
      }],
    },
  };

  return (
    <div>
      <div>
        <h3>Monthly Revenue Chart</h3>
        <Bar data={monthlyChartData} options={options} />
      </div>
      <div>
        <h3>Weekly Revenue Chart</h3>
        <Bar data={weeklyChartData} options={options} />
      </div>
    </div>
  );
};

export default AdminChart;
