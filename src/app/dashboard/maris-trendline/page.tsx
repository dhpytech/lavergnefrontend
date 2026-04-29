'use client';

import React, { useState, useEffect } from 'react';
import { FactoryTrendChart } from '@/src/components/dashboard/FactoryTrendChart'
import { EmployeePerformanceChart } from '@/src/components/dashboard/EmployeePerformanceChart';

export default function MarisDashboard() {
  const [apiData, setApiData] = useState(null);
  const [activePage, setActivePage] = useState('TREND_PAGE'); // 'TREND_PAGE' hoặc 'DETAIL_PAGE'
  const [selectedEmp, setSelectedEmp] = useState(null);

  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-04-30');

  const fetchData = () => {
    const url = `http://127.0.0.1:8000/dashboard/monthly-maris?start=${startDate}&end=${endDate}`;
    fetch(url).then(res => res.json()).then(json => setApiData(json));
  };

  useEffect(() => { fetchData(); }, []);

  if (!apiData) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  // Lấy danh sách nhân viên từ tháng gần nhất để render menu bên phải
  const lastMonth = Object.keys(apiData).pop();
  const employeeList = Object.keys(apiData[lastMonth]?.DETAILS || {});

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-black text-blue-700 tracking-tighter">LAVERNE VN</h1>
          <div className="h-6 w-[1px] bg-gray-300"></div>
          <div className="flex items-center space-x-4">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-1 rounded text-sm"/>
            <span className="text-gray-400">→</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-1 rounded text-sm"/>
            <button onClick={fetchData} className="bg-blue-600 text-white px-4 py-1 rounded text-sm font-bold shadow-sm">VIEW</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[500px]">
            {activePage === 'TREND_PAGE' ? (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Xu Hướng Sản Xuất Toàn Xưởng</h2>
                <FactoryTrendChart data={apiData} />
              </div>
            ) : (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Chi Tiết Nhân Viên</h2>
                <p className="text-blue-600 font-medium mb-6">Đang xem: {selectedEmp}</p>
                <EmployeePerformanceChart data={apiData} employeeName={selectedEmp} />
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR (CONTAINER) */}
        <aside className="w-80 bg-white border-l flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Navigation</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* THUMBNAIL PAGE 1: TRENDLINE */}
            <div
              onClick={() => setActivePage('TREND_PAGE')}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${activePage === 'TREND_PAGE' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
            >
              <p className="text-sm font-bold mb-2">Trendline Tổng</p>
              <div className="h-16 w-full bg-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">FACTORY VIEW</div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Employee Details</h4>
              {/* THUMBNAIL LIST CHO TỪNG NHÂN VIÊN */}
              <div className="space-y-2">
                {employeeList.map(emp => (
                  <div
                    key={emp}
                    onClick={() => {
                      setActivePage('DETAIL_PAGE');
                      setSelectedEmp(emp);
                    }}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-sm font-medium ${activePage === 'DETAIL_PAGE' && selectedEmp === emp ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                  >
                    {emp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
