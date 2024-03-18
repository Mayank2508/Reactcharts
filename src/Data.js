import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';

const Data = () => {
  const [hotelRequests, setHotelRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://checkinn.co/api/v1/int/requests');
        setHotelRequests(response.data.requests);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = () => {
    if (hotelRequests.length > 0) {
      // Process data to group requests by hotel
      const hotels = {};
      hotelRequests.forEach((request) => {
        const hotelId = request.hotel.id;
        if (!hotels[hotelId]) {
          hotels[hotelId] = {
            hotelName: request.hotel.name,
            requests: 0,
          };
        }
        hotels[hotelId].requests += 1;
      });

      // Prepare data for ApexCharts
      return {
        series: [{ data: Object.values(hotels).map((hotel) => hotel.requests) }],
        options: {
          chart: {
            type: 'line',
            height: 350,
          },
          xaxis: {
            categories: Object.values(hotels).map((hotel) => hotel.hotelName),
          },
          title: {
            text: 'Requests per Hotel (Line Chart)',
            align: 'center',
          },
        },
      };
    }
    return {
      series: [{ data: [] }], // Empty series data
      options: {} // Empty options
    };
  };

  return (
    <div id="chart">
      {hotelRequests.length > 0 ? (
        <ReactApexChart options={generateChartData().options} series={generateChartData().series} type="line" height={350} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Data;
