"use client";
import React, { useState, useEffect } from 'react';
import { EmployeeHeader } from '@/src/components/dashboard/employee/EmployeeSlicer';
import { EmployeeComparisonChart } from '@/src/components/dashboard/employee/EmployeeDetailChart';
import { StatMiniCard } from '@/src/components/dashboard/employee/EmployeeStatCards';

export default function EmployeeDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [employees, setEmployees] = useState<string[]>([]);
  const [selectedEmps, setSelectedEmps] = useState<string[]>([]);

  // Quản lý tháng lọc
  const [startDate, setStartDate] = useState('2025-01');
  const [endDate, setEndDate] = useState('2026-04');
  const [loading, setLoading] = useState(true);

  // Load danh sách nhân viên 1 lần
  useEffect(() => {
    fetch('http://127.0.0.1:8000/dashboard/active-employees')
      .then(res => res.json())
      .then(json => {
        setEmployees(json);
        if (json.length > 0) setSelectedEmps([json[0]]); // Mặc định chọn người đầu tiên
      });
  }, []);

  // Fetch dữ liệu biểu đồ mỗi khi thay đổi thời gian
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/dashboard/monthly-maris?start=${startDate}-01&end=${endDate}-31`);
        const json = await res.json();
        setData(json);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <EmployeeHeader
        employees={employees}
        selectedEmps={selectedEmps}
        onEmpChange={setSelectedEmps}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(s, e) => { setStartDate(s); setEndDate(e); }}
      />

      {loading ? (
        <div className="h-64 flex items-center justify-center font-black text-slate-300 animate-pulse">
          ĐANG ĐỒNG BỘ DỮ LIỆU...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Vùng MiniCharts - Chỉ hiển thị nếu chọn đúng 1 người để tránh rối mắt */}
          {selectedEmps.length === 1 && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bạn có thể thêm logic tính toán tích lũy cho MiniCard ở đây */}
             </div>
          )}

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase">Biến động năng suất</h2>
            <EmployeeComparisonChart data={data} selectedEmps={selectedEmps} />
          </div>
        </div>
      )}
    </div>
  );
}
