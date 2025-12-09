// components/SafetyDurationDisplay.tsx
'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react'; // Icon đồng hồ

// Định nghĩa kiểu dữ liệu cho state
interface FormattedDuration {
  hours: string;
  minutes: string;
}

interface DurationData {
  formatted_time: string; // Ví dụ: "130816 hours: 30 minutes"
}

const API_DURATION_URL = `${process.env.NEXT_PUBLIC_API_URL}/safety/duration/`;

// Hàm tiện ích: Phân tích chuỗi thời gian bằng JavaScript
const parseFormattedTime = (formattedTime: string): FormattedDuration => {
  // Regex để tìm các số đứng trước " hours" và " minutes"
  const hoursMatch = formattedTime.match(/(\d+) hours/);
  const minutesMatch = formattedTime.match(/(\d+) minutes/);

  // Sử dụng padStart để đảm bảo luôn có 2 chữ số (ví dụ: 05, 10)
  const hours = hoursMatch ? hoursMatch[1] : '00';
  const minutes = minutesMatch ? minutesMatch[1].padStart(2, '0') : '00';

  return { hours, minutes };
};


export default function SafetyDurationDisplay() {
  const [duration, setDuration] = useState<FormattedDuration>({ hours: '---', minutes: '---' });
  const [isLoading, setIsLoading] = useState(true);

  const fetchDuration = async () => {
    try {
      const response = await fetch(API_DURATION_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch safety duration.');
      }
      const data: DurationData = await response.json();

      const parsed = parseFormattedTime(data.formatted_time);
      setDuration(parsed);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching safety duration:", error);
      setDuration({ hours: 'LỖI', minutes: 'LỖI' });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDuration();

    // Cập nhật lại sau mỗi 60 giây (1 phút)
    const intervalId = setInterval(fetchDuration, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-1 rounded-lg border border-sky-400 shadow-md bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">

      {/* 1. Icon và Tiêu đề */}
      <div className="flex flex-item-center items-start justify-center gap-0.5">
          <Clock className="w-6 h-6 text-blue-700" />
          <span className="font-bold text-[16px] text-blue-700 whitespace-nowrap uppercase ml-2">  Safety Time </span>
      </div>

      {/* 2. Hiển thị Giờ */}
      <div className="flex flex-col items-center bg-gray-100/70 rounded-md px-2 py-1 border border-gray-300 shadow-inner min-w-[70px]">
          <span className="text-xl md:text-2xl font-black text-blue-600 leading-none tabular-nums">
              {isLoading ? '...' : duration.hours}
          </span>
          <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5 uppercase">Hour</span>
      </div>

      {/* 3. Dấu hai chấm phân cách */}
      <span className="text-xl font-extrabold text-sky-700 leading-none">:</span>

      {/* 4. Hiển thị Phút */}
      <div className="flex flex-col items-center bg-gray-100/70 rounded-md px-2 py-1 border border-gray-300 shadow-inner min-w-[50px]">
          <span className="text-xl md:text-2xl font-black text-blue-600 leading-none tabular-nums">
              {isLoading ? '...' : duration.minutes}
          </span>
          <span className="text-[10px] text-gray-500 font-medium leading-none mt-0.5 uppercase">Minutes</span>
      </div>

    </div>
  );
}