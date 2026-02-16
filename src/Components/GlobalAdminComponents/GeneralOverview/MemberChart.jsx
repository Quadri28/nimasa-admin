import React from "react";
import { Chart as ChartJs, Legend, Tooltip, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJs.register(Tooltip, Legend, ArcElement);

const MemberChart = ({memberDetails}) => {
  const labels = memberDetails.map((data)=>data.gender)
  const datas = memberDetails.map((data)=>data.count)
    const data = {
        labels: labels,
        datasets: [
          {
            data: datas,
            backgroundColor: ["#3785FB", "#4CB8E6", "#F6911E", '#E8F1FF'],
          },
        ],
      };
      const options = {
        responsive: true,
    maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              usePointStyle: true,
            },
          },
        },
      };
      return (
    <div style={{ display: "flex", justifyContent: "center", height: "300px", alignItems:'center' }} className="p-2">
          <Doughnut data={data} options={options} />
        </div>
      );
    };
export default MemberChart
