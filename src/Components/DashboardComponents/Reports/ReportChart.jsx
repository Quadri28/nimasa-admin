import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Legend,
  Tooltip,
  LinearScale,
  BarElement,
  CategoryScale,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ReportChart = () => {
   
      const data = {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "April",
          "May",
          "June",
          'July',
          'Aug',
          'Sept',
          'Oct',
          'Nov',
          'Dec'
        ],
        datasets: [
          {
            label: "Products",
            data: [600, 900, 750, 800, 700, 1000, 500, 900, 300, 500, 400, 800],
            backgroundColor: [
              "#033E96",
              "#0452C8",
              "#022B69",
              "#3785FB",
              "#69A4FC",
              "#9BC2FD",
            ],
            borderRadius: 5,
            barPercentage: 0.8,
            categoryPercentage: 0.8,
          },
        ],
      };
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      };
      return (
        <div style={{backgroundColor:'#FAFAFA', height:'220px',}}
         className="rounded-3 my-4 p-2">
          <Bar data={data} options={options}></Bar>
        </div>
      );
    };
export default ReportChart
