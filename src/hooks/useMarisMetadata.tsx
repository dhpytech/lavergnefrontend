import { useState, useEffect } from 'react';

export const useMarisMetadata = () => {
  const [data, setData] = useState({
    employees: [] as any[],
    productCodes: [] as string[],
    stopCodes: ["M01 - Mechanical", "E01 - Electrical", "P01 - Power"],
    problemCodes: ["Q01 - Color", "Q02 - Black Spot", "Q03 - Moisture"],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        const [empRes, prodRes] = await Promise.all([
          fetch(`${baseUrl}/employee/employee/`),
          fetch(`${baseUrl}/itemcode/item-code/`)
        ]);

        const employees = empRes.ok ? await empRes.json() : [];
        const products = prodRes.ok ? await prodRes.json() : [];

        setData(prev => ({
          ...prev,
          employees,
          productCodes: products.map((p: any) => p.code || p.item_code)
        }));
      } catch (error) {
        console.error("Sử dụng dữ liệu Fallback");
        setData(prev => ({
          ...prev,
          employees: [{ id: 1, name: "Operator Default" }],
          productCodes: ["PROD-001", "PROD-002"]
        }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
};
