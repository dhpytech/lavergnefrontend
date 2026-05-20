"use client";

import React, { useState, useEffect } from 'react';

interface ShiftData {
  product_codes: string[];
  [kpiKey: string]: string | string[];
}

interface IsoReportResponse {
  date: string;
  day_shift: ShiftData;
  night_shift: ShiftData;
  total: ShiftData;
}

export default function MarisIsoDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-18');
  const [productCode, setProductCode] = useState<string>('');
  const [report, setReport] = useState<IsoReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadIsoData = async () => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/entries/daily-report?date=${selectedDate}`;
      if (productCode) url += `&productCode=${productCode}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu với MarisQuery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIsoData();
  }, [selectedDate]);

  // Định nghĩa thứ tự các hàng hiển thị trên Dashboard tương khớp 100% với cấu trúc Key của ProductionStats
  const isoRows = [
    { label: "PRODUCTION VOLUME (KG)", key: "PRODUCTION (KG)", limit: "-" },
    { label: "DOWN-LEVEL / NON-CONFORMANCE (KG)", key: "DL/NC (KG)", limit: "-" },
    { label: "TOTAL SCRAP EXTRUDED (KG)", key: "SCRAP (KG)", limit: "-" },
    { label: "SCRAP RATIO PER PRODUCTION (%)", key: "SCRAP/PRODUCTION (%)", limit: "< 1.5%" },
    { label: "VISUAL / RE-WORK LAB (KG)", key: "VISSLAB (KG)", limit: "-" },
    { label: "TOTAL OPERATIONAL STOP (HOUR)", key: "STOP TIME (HOUR)", limit: "-" },
    { label: "NET OUTPUT CAPACITY (KG/HOUR)", key: "NET/HOUR (KG/HOUR)", limit: "-" },
    { label: "TIME UTILISATION EFFICIENCY (%)", key: "UTILISATION (%)", limit: ">= 85.0%" },
    { label: "QUALITY YIELD PERFORMANCE (%)", key: "YIELD (%)", limit: ">= 98.5%" },
    { label: "OVERALL EQUIPMENT EFFICIENCY (%)", key: "OEE (%)", limit: ">= 90.0%" },
    { label: "MEAN TIME TO REPAIR (HOUR)", key: "MTTR (HOUR)", limit: "-" },
    { label: "MEAN TIME BETWEEN FAILURES (HOUR)", key: "MTBF (HOUR)", limit: "-" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-6">

        {/* THANH ĐIỀU KHIỂN BỘ LỌC ĐẦU VÀO */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200/80">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase">Ngày Báo Cáo:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 text-xs font-bold text-blue-600 bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 uppercase">Mã Hàng:</span>
              <input
                type="text"
                placeholder="Ví dụ: S014..."
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                className="border border-slate-300 rounded px-2 py-1 text-xs font-semibold bg-white w-32 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={loadIsoData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded transition-colors"
          >
            Query Sync
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center font-bold text-slate-400 animate-pulse tracking-widest uppercase">
            MarisQuery đang trích xuất dữ liệu phân xưởng...
          </div>
        ) : report ? (
          <div>
            <h2 className="text-center font-black text-sm mb-4 uppercase text-slate-900 tracking-wider">
              MARIS OPERATIONAL ISO PERFORMANCE SPECIFICATION
            </h2>

            <table className="w-full border-collapse border-2 border-slate-900 text-xs shadow-sm">
              <thead>
                <tr className="bg-slate-800 text-white font-bold text-center uppercase tracking-wider">
                  <th className="border border-slate-900 p-2.5 text-left w-[38%]">ISO Items & Parameters</th>
                  <th className="border border-slate-900 p-2.5 w-[14%] bg-amber-500 text-slate-900">Standard</th>
                  <th className="border border-slate-900 p-2.5 w-[14%]">Day Shift</th>
                  <th className="border border-slate-900 p-2.5 w-[14%]">Night Shift</th>
                  <th className="border border-slate-900 p-2.5 w-[20%] bg-slate-100 text-slate-900">Total / Day</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b-2 border-slate-900 font-semibold text-slate-700">

                {/* Hàng hiển thị Mã Sản Phẩm đặc thù */}
                <tr className="bg-slate-50/50">
                  <td className="border border-slate-900 p-2 font-bold text-slate-900">Material Type (Product Code)</td>
                  <td className="border border-slate-900 p-2 text-center bg-amber-50 text-slate-400">-</td>
                  <td className="border border-slate-900 p-2 text-center text-blue-600 font-bold">
                    {report.day_shift.product_codes?.join(", ") || "No Data"}
                  </td>
                  <td className="border border-slate-900 p-2 text-center text-blue-600 font-bold">
                    {report.night_shift.product_codes?.join(", ") || "No Data"}
                  </td>
                  <td className="border border-slate-900 p-2 text-center bg-slate-100 text-blue-900 font-bold">
                    {report.total.product_codes?.join(", ") || "No Data"}
                  </td>
                </tr>

                {/* Vòng lặp map tự động trúng đích các trường tính toán từ ProductionStats */}
                {isoRows.map((row) => {
                  const isCoreMetric = ["PRODUCTION (KG)", "YIELD (%)", "OEE (%)"].includes(row.key);

                  return (
                    <tr key={row.key} className={isCoreMetric ? "bg-blue-50/40 font-bold text-slate-900" : ""}>
                      <td className="border border-slate-900 p-2">{row.label}</td>
                      <td className="border border-slate-900 p-2 text-center bg-amber-50/60 font-bold text-amber-900">{row.limit}</td>
                      <td className="border border-slate-900 p-2 text-center">{report.day_shift[row.key] || "0"}</td>
                      <td className="border border-slate-900 p-2 text-center">{report.night_shift[row.key] || "0"}</td>
                      <td className={`border border-slate-900 p-2 text-center bg-slate-100 ${isCoreMetric ? "text-blue-700 font-black text-sm" : ""}`}>
                        {report.total[row.key] || "0"}
                      </td>
                    </tr>
                  );
                })}

              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-semibold border-2 border-dashed rounded-xl">
            Không tìm thấy bản ghi dữ liệu phù hợp với điều kiện FetchParams hiện tại.
          </div>
        )}
      </div>
    </div>
  );
}