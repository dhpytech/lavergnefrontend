import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMetalMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
    actions: ['Sifting', 'Grinding', 'Cutting', 'Inspection'],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';
        const [empRes, prodRes] = await Promise.all([
          axios.get(`${BASE_URL}/employee/employee/`),
          axios.get(`${BASE_URL}/itemcode/items-code/`),
        ]);
        setData(prev => ({
          ...prev,
          employees: empRes.data,
          productCodes: prodRes.data.map((item: any) => item.item_name),
        }));
      } catch (error) {
        console.error("Metal Metadata Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
};
