import { Bar } from 'react-chartjs-2';

export const EmployeePerformanceChart = ({ data, employeeName }) => {
  const months = Object.keys(data);
  const chartData = {
    labels: months,
    datasets: [
      { label: `Sản lượng: ${employeeName}`, data: months.map(m => data[m].DETAILS[employeeName]?.prod || 0), backgroundColor: '#5d5fef' },
      { label: `Hiệu suất (%)`, data: months.map(m => data[m].DETAILS[employeeName]?.efficiency || 0), type: 'line', borderColor: 'orange', yAxisID: 'y1' }
    ]
  };
  return <Bar data={chartData} options={{ scales: { y1: { position: 'right', min: 0, max: 100 } } }} />;
};
