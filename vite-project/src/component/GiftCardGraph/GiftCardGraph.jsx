import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const GiftCardGraph = () => {
  // State to hold the data for the graph
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        // Replace the URL with the endpoint to fetch the data from your server
        const response = await fetch(`http://localhost:5000/admin/giftcards-graph`);
        const data = await response.json();
        
        // Process the fetched data and update the graphData state
        setGraphData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error if necessary
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run only once on component mount
  console.log(graphData);
  // Function to process the fetched data and return the appropriate data structure for the graph
  const processData = () => {
    const labels = graphData.map(entry => new Date(entry.purchase_day));
    const data = graphData.map(entry => parseFloat(entry.total_initial_amount_per_day));

    return { labels, data };
  };

  // Data for the chart
  const { labels, data } = processData();

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Initial Amount per Day',
        data: data,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Options for the chart
  const options = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        },
        scaleLabel: {
          display: true,
          labelString: 'Purchase Date'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Initial Amount'
        }
      }]
    }
  };

  return (
    <div>
      <h2>Gift Card Graph</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GiftCardGraph;
