import React, { useContext, useEffect, useState } from "react";
import { Chart as ChartJs, Legend, Tooltip, ArcElement } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "../axios";
import { UserContext } from "../AuthContext";

ChartJs.register(Tooltip, Legend, ArcElement);

const OverviewChart = ({members}) => {

  const maleFigure = members
    .filter((member) => member.gender === "Male")
    .map((male) => male.count);
  const femaleFigure = members
    .filter((member) => member.gender === "Female")
    .map((female) => female.count);
  const coopFigure = members
    .filter((member) => member.gender === "Corporate Entity")
    .map((corporate) => corporate.count);
    const undefined = members
    .filter((member) => member.gender === "Not Available")
    .map((corporate) => corporate.count);
  const flattenedArray = [maleFigure, femaleFigure, coopFigure, undefined].flat();

  const data = {
    labels: [
      `Male members ${maleFigure}`,
      `Female members ${femaleFigure}`,
      `Corporate Members ${coopFigure.length > 0 ? coopFigure : 0}`,
      `Not available ${undefined.length >0 ? undefined : 0}`,
    ],
    datasets: [
      {
        data: flattenedArray,
        backgroundColor: ["#082460", "#007D53", '#0098DA', "#4CB8E6", ],
      },
    ],
  };
 const totalMembers= members.reduce((sum, item) => sum + (item.count || 0), 0);

 const centerTextPlugin = {
  id: "centerText",
  beforeDraw: (chart) => {
    if (!chart || !chart.ctx) return;
    const { ctx, chartArea: { width, height } } = chart;

    ctx.save();
    const fontSize = Math.min(width, height) / 15; // adjust this factor (e.g., 8-12) for bigger or smaller text
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const text = `${totalMembers.toLocaleString()} members`;
    const textX = width / 2;
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.restore();
  },
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
    <div style={{ display: "flex", justifyContent: "center", height: "300px", alignItems:'center' }}>
        {members.length > 0 ? (
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    ) : (
      <p>Loading chart...</p>
    )}
    </div>
  );
};

export default OverviewChart;
