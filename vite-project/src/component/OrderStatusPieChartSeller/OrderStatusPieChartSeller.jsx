import React from 'react';
import { Pie } from 'react-chartjs-2';

const OrderStatusPieChart = ({ uniqueOrderData }) => {
    // Extracting order status and count data, excluding null status
    const orderStatusData = uniqueOrderData.map(order => order.order_status).filter(status => status !== null);
    const orderStatusCount = orderStatusData.reduce((acc, status) => {
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    // Chart data
    const data = {
        labels: Object.keys(orderStatusCount),
        datasets: [
            {
                label: 'Order Count',
                data: Object.values(orderStatusCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className='chart-container'>
            <h2>Order Status Pie Chart</h2>
            <Pie data={data} />
        </div>
    );
};

export default OrderStatusPieChart;
