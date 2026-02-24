import { useState, useEffect } from 'react';
import axios from 'axios';

export const useBaggingMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
        const [empRes, prodRes] = await Promise.all([
          axios.get(`${BASE_URL}/employee/employee/`),
          axios.get(`${BASE_URL}/itemcode/items-code/`),
        ]);

        setData({
          employees: empRes.data,
          productCodes: prodRes.data.map((item: any) => item.item_name),
        });
      } catch (error) {
        console.error("Bagging API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
};
