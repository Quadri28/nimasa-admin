
import React from 'react'
import { Bar } from 'react-chartjs-2'
import {Chart as ChartJs, Legend, Tooltip, LinearScale, BarElement, CategoryScale} from 'chart.js'
ChartJs.register( Legend, Tooltip, LinearScale, BarElement, CategoryScale)

const RevenueChart = ({revenues}) => {
  const labels= revenues.map(revenue=>revenue.month)
  const datas= revenues.map(revenue=>revenue.revenue)
    const data={
        labels:labels,
        datasets:[{
            label:'Revenue',
            data: datas,
            backgroundColor:[
            "#033E96",
            "#0452C8",
            "#022B69",
            "#3785FB",
            "#69A4FC",
            "#9BC2FD",
          ],
            borderRadius: 8,
            barPercentage:.7,
            categoryPercentage:1
    }]
    }
    const options={
        responsive:true,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
    }
  return (
    <div>
      <Bar data={data} options={options}>

      </Bar>
    </div>
  )
}

export default RevenueChart
