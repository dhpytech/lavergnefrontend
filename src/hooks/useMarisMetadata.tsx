// src/hooks/useMarisMetadata.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMarisMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
    stopCodes: [],
    problemCodes: [],
    dlnc_case: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
        const [empRes, prodRes,stopRes,problemRes,caseRes] = await Promise.all([
          axios.get(`${BASE_URL}/employee/employee/`),
          axios.get(`${BASE_URL}/itemcode/items-code/`),
          axios.get(`${BASE_URL}/stoptime/stop-time/`),
          axios.get(`${BASE_URL}/problem/problems/`),
          axios.get(`${BASE_URL}/dlnc_case/dlnc_case/`),
        ]);

        setData(prev => ({
          ...prev,
          // Sử dụng employee_name từ API của bạn
          employees: empRes.data,
          // Sử dụng item_name từ API của bạn
          productCodes: prodRes.data.map((item: any) => item.item_name),
          stopCodes: stopRes.data.map((item: any)=> item.stop_time_name),
          problemCodes: problemRes.data.map((item:any)=> item.problem_code),
          dlnc_case: caseRes.data.map((item:any)=> item.dlnc_case_name),
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
