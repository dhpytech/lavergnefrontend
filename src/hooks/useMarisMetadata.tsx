// src/hooks/useMarisMetadata.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMarisMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
    stopCodes: ["S01 - Mechanical", "S02 - Electrical", "S03 - Setup"],
    problemCodes: ["Q01 - Color", "Q02 - Black Spot", "Q03 - Moisture"],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, prodRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/employee/employee/'),
          axios.get('http://127.0.0.1:8000/itemcode/items-code/')
        ]);

        setData(prev => ({
          ...prev,
          // Sử dụng employee_name từ API của bạn
          employees: empRes.data,
          // Sử dụng item_name từ API của bạn
          productCodes: prodRes.data.map((item: any) => item.item_name)
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
