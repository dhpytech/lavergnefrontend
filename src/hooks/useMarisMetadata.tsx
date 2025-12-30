// src/hooks/useMarisMetadata.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMarisMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
    stopCodes: [],
    problemCodes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, prodRes,stopRes,problemRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/employee/employee/'),
          axios.get('http://127.0.0.1:8000/itemcode/items-code/'),
          axios.get('http://127.0.0.1:8000/stoptime/stop-time/'),
          axios.get('http://127.0.0.1:8000/problem/problems/'),
        ]);

        setData(prev => ({
          ...prev,
          // Sử dụng employee_name từ API của bạn
          employees: empRes.data,
          // Sử dụng item_name từ API của bạn
          productCodes: prodRes.data.map((item: any) => item.item_name),
          stopCodes: stopRes.data.map((item: any)=> item.stop_time_name),
          problemCodes: problemRes.data.map((item:any)=> item.problem_code),
        }));
      } catch (error) {
        console.error("Lỗi API, kiểm tra CORS hoặc Server:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
};
