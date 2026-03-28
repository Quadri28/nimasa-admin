import React from 'react'
import { Bar } from 'react-chartjs-2'
import {Chart as ChartJs, Legend, Tooltip, LinearScale, BarElement, CategoryScale} from 'chart.js'
ChartJs.register( Legend, Tooltip, LinearScale, BarElement, CategoryScale)
const FinancialOverviewChart = ({financial}) => {

   const financialLabels = financial.map(fin => {
  const name = fin.productName;
  return name.length > 5 ? name.slice(0, 5) + '...' : name;
});
  const financialValues= financial.map(fin=>(fin.monthlycontribution))

    const data={
        labels:financialLabels,
        datasets:[{
            label:'Financial Overview',
            data: financialValues,
            backgroundColor:['#033E96', '#0452C8', '#022B69', '#3785FB', '#69A4FC', '#9BC2FD'],
            borderRadius: 5,
            barPercentage:.9,
            categoryPercentage:.8
    }]
    }
    
 const options = {
  responsive: true,
  animation: false,
  plugins: {
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const index = tooltipItems[0].dataIndex;
          return financial[index].productName; // Full name from original data
        }
      }
    }
  },
  scales: {
    x: {
      ticks: {
        minRotation: 90,
        maxRotation: 90,
        align: 'start', // or 'end' depending on your layout
        callback: function (value, index) {
          return financialLabels[index]; // Already shortened
        }
      },
      grid: { display: false },
    },
    y: {
      grid: { display: false },
    },
  },
};

  return (
    <div style={{height:'300px'}}>
      <Bar data={data} options={options}/>
    </div>
  )
}

export default FinancialOverviewChart
