import React from 'react';
import { Line } from 'react-chartjs-2';

const GiftCardGraph = ({ giftCards }) => {
  // Extracting purchase dates and initial amounts from gift cards
  const purchaseDates = giftCards.map(giftCard => new Date(giftCard.purchase_date));
  const initialAmounts = giftCards.map(giftCard => giftCard.initial_amount);

  // Data for the chart
  const data = {
    labels: purchaseDates,
    datasets: [
      {
        label: 'Initial Amount vs Purchase Date',
        data: initialAmounts,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Options for the chart
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
          labelString: 'Initial Amount'
        }
      }]
    }
  };
  


  return (
    <div>
      <h2>Gift Card Graph</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default GiftCardGraph;
