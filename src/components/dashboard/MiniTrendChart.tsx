"use client";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface MiniChartProps {
  data: any;
  title: string;
  datasetsConfig: any[];
}

export const MiniTrendChart = ({ data, title, datasetsConfig }: MiniChartProps) => {
  const months = Object.keys(data);

  const chartData = {
    labels: months,
    datasets: datasetsConfig.map(config => ({
      ...config,
      data: months.map(m => {
        const keys = config.dataPath.split('.');
        let value = data[m];
        for (const key of keys) {
          if (value && value[key] !== undefined) {
            value = value[key];
          } else {
            value = 0;
            break;
          }
        }
        return value;
      }),
      borderWidth: 1.5,
      pointRadius: 1,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Tỉ lệ khung hình (nếu maintainAspectRatio là true)
    resizeDelay: 0, // Độ trễ khi thay đổi kích thước (ms)

    interaction: {
      mode: 'index', // 'point', 'nearest', 'index', 'dataset', 'x', 'y'
      intersect: false, // Nếu false, hover vào cột dọc sẽ hiện tooltip thay vì phải chạm đúng điểm
      axis: 'x', // Trục ưu tiên để tính toán tương tác
    },

    plugins: {

      legend: {
        display: false,
        position: 'top', // 'top', 'left', 'bottom', 'right'
        align: 'center', // 'start', 'center', 'end'
        labels: {
          usePointStyle: true, // Hiển thị chấm tròn thay vì ô vuông
          padding: 10,
          font: {size: 5, family: 'Arial'},
        },
      },
      title: { display: false }, // Tắt tiêu đề trong biểu đồ mini
      tooltip: { enabled: false }, // Tắt tooltip
      grid: { display: true },
    },

    scales: {
      x: {
        display: false, // Hiển thị trục X
        title: {
          display: true,
          text: 'Tháng',
          color: '#666'
        },
        grid: {
          display: true, // Ẩn/hiện lưới dọc
          drawBorder: true,
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          maxRotation: 0, // Độ xoay của chữ
          autoSkip: true, // Tự động ẩn bớt nhãn nếu quá dày
          color: '#999'
        }
      },
      y: {
        display: true,
        beginAtZero: true, // Luôn bắt đầu từ số 0
        title: {
          display: true,
        },
        grid: {
          display: true, // Ẩn/hiện lưới ngang
          color: 'rgba(0,0,0,0.05)',
          drawTicks: false
        },
        ticks: {
          stepSize: 10, // Bước nhảy của giá trị
          callback: function(value) { return value; } // Format giá trị hiển thị
        }
      }
    },
    elements: {
        line: {
            tension: 0.3 // Làm đường cong nhẹ
        }
    },
    animation: {
      duration: 1000, // Thời gian chạy hiệu ứng (ms)
      easing: 'easeInOutQuart', // Kiểu chuyển động
    }
  };

  //
  //   // 3. Cấu hình các Plugins (Legend, Tooltip, Title...)
  //   plugins: {
  //     // Chú thích (Màu sắc các đường)
  //     legend: {
  //       display: true,
  //       position: 'top', // 'top', 'left', 'bottom', 'right'
  //       align: 'center', // 'start', 'center', 'end'
  //       labels: {
  //         usePointStyle: true, // Hiển thị chấm tròn thay vì ô vuông
  //         padding: 20,
  //         font: { size: 12, family: 'Arial' }
  //       }
  //     },
  //     // Tiêu đề biểu đồ
  //     title: {
  //       display: false,
  //       // text: 'Tiêu Đề Biểu Đồ',
  //       // font: { size: 16, weight: 'bold' },
  //       // padding: { top: 10, bottom: 30 }
  //     },
  //     // Chú thích khi di chuột (Tooltip)
  //     tooltip: {
  //       enabled: true,
  //       backgroundColor: 'rgba(0, 0, 0, 0.8)',
  //       titleFont: { size: 14 },
  //       bodyFont: { size: 13 },
  //       padding: 10,
  //       cornerRadius: 4,
  //       displayColors: true, // Hiển thị ô màu đại diện bên trong tooltip
  //     },
  //   },
  //
  //   // 4. Cấu hình các trục (Scales)
  //   scales: {
  //     x: {
  //       display: true, // Hiển thị trục X
  //       title: {
  //         display: true,
  //         text: 'Tháng',
  //         color: '#666'
  //       },
  //       grid: {
  //         display: false, // Ẩn/hiện lưới dọc
  //         drawBorder: true,
  //         color: 'rgba(0,0,0,0.1)'
  //       },
  //       ticks: {
  //         maxRotation: 0, // Độ xoay của chữ
  //         autoSkip: true, // Tự động ẩn bớt nhãn nếu quá dày
  //         color: '#999'
  //       }
  //     },
  //     y: {
  //       display: true,
  //       beginAtZero: true, // Luôn bắt đầu từ số 0
  //       title: {
  //         display: true,
  //         text: 'Giá trị'
  //       },
  //       grid: {
  //         display: true, // Ẩn/hiện lưới ngang
  //         color: 'rgba(0,0,0,0.05)',
  //         drawTicks: false
  //       },
  //       ticks: {
  //         stepSize: 10, // Bước nhảy của giá trị
  //         callback: function(value) { return value + ' đơn vị'; } // Format giá trị hiển thị
  //       }
  //     }
  //   },
  //
  //   // 5. Cấu hình mặc định cho các phần tử đồ họa (Elements)
  //   elements: {
  //     line: {
  //       tension: 0.4, // Độ cong của đường (0 là đường thẳng)
  //       borderColor: 'blue',
  //       borderWidth: 2,
  //       fill: false, // Có đổ màu vùng dưới đường không
  //       capBezierPoints: true
  //     },
  //     point: {
  //       radius: 3, // Kích thước điểm
  //       hitRadius: 10, // Vùng nhận diện khi di chuột qua điểm
  //       hoverRadius: 5, // Kích thước khi hover
  //       pointStyle: 'circle' // 'cross', 'dash', 'rect', 'star', v.v.
  //     }
  //   },
  //
  //   // 6. Hiệu ứng hoạt họa (Animations)
  //   animation: {
  //     duration: 1000, // Thời gian chạy hiệu ứng (ms)
  //     easing: 'easeInOutQuart', // Kiểu chuyển động
  //   }
  // };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
};
