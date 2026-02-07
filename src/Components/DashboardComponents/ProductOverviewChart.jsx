import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { UserContext } from "../AuthContext";
import axios from "../axios";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductOverviewChart = () => {
  const [products, setProducts] = useState([]);
  const { credentials } = useContext(UserContext);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await axios("DashBoard/product-transaction-overview-chart", {
        headers: { Authorization: `Bearer ${credentials.token}` },
      });
      setProducts(response.data.data.transactionProductOverviewChart.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }, [credentials.token]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const productNames = useMemo(
    () => Array.from(new Set(products.flatMap((item) => Object.keys(item.products)))),
    [products]
  );

  const allMonths = useMemo(
    () => [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    []
  );

  const colors = ["#17becf", "#2ca02c", "#ff7f0e", "#1f77b4"];

  const datasets = useMemo(
    () => productNames.map((product, index) => ({
      label: product,
      data: allMonths.map((month) => {
        const monthData = products.find((item) => item.month === month);
        return monthData?.products[product] || 0;
      }),
      borderColor: colors[index % colors.length],
      backgroundColor: "transparent",
      tension: 0.4,
    })),
    [products, productNames, allMonths, colors]
  );

  const lineChartData = useMemo(
    () => ({ labels: allMonths, datasets }),
    [allMonths, datasets]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      animation: { duration: 0 },
      plugins: {
        zoom: {
          pan: {
            enabled: false
          },
          zoom: {
            wheel: {
              enabled: false
            },
            pinch: {
              enabled: false
            },
            drag: {
              enabled: false
            },
            mode: 'xy',
          }
        },
        legend: { 
          labels: { 
            color: "#000",  
            usePointStyle: true,
          } 
        },
      },
      scales: {
        x: { ticks: { color: "#000" }, grid: { display: false } },
        y: { ticks: { color: "#000" }, grid: { color: "#444" } },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'index',
        intersect: false,
        animationDuration: 0,
      },
    }),
    []
  );

  return (
    <div style={{ width: "100%", height:'100%'}}>
      <Line data={lineChartData} options={chartOptions} />
    </div>
  );
};

export default ProductOverviewChart;
