"use client";

import React, { useState, useEffect } from 'react';

export default function MarisExcelDailyReport() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-17');
  const [productCode, setProductCode] = useState<string>('');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let url = `http://127.0.0.1:8000/entries/daily-report/?date=${selectedDate}`;
      if (productCode) url += `&productCode=${productCode}`;
      const res = await fetch(url);
      if (res.ok) setReport(await res.json());
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReportData(); }, [selectedDate]);

  // Hàm helper lấy dữ liệu an toàn từ JSON Backend cho bảng chính
  const getVal = (shift: 'day_shift' | 'night_shift' | 'total', key: string, fallback = "-") => {
    if (!report || !report[shift]) return fallback;
    return report[shift][key]?.value ?? fallback;
  };

  // Hàm lấy giá trị dlnc chi tiết theo từng case lỗi con
  const getDlncCaseVal = (shift: 'day' | 'night' | 'total', caseName: string) => {
    if (!report || !report.dlnc_breakdown || !report.dlnc_breakdown[shift]) return "-";
    const val = report.dlnc_breakdown[shift][caseName];
    return val !== undefined && val !== 0 ? val.toLocaleString() : "-";
  };

  // Trích xuất comment ghi chú của từng ca
  const getShiftComment = (shiftName: string) => {
    if (!report || !report.raw_production_details) return "";
    const shiftRecords = report.raw_production_details.filter(
      (r: any) => r.shift?.toLowerCase() === shiftName.toLowerCase()
    );
    return shiftRecords.map((r: any) => r.comment).filter(Boolean).join(" / ");
  };

  return (
    <div className="flex min-h-screen bg-slate-200 text-slate-900 font-sans antialiased">

      {/* SIDEBAR TRÁI - THANH ĐIỀU HƯỚNG MÀU XANH */}
      <aside className="w-60 bg-[#0070c0] text-white flex flex-col justify-between shrink-0 p-4 shadow-xl">
        <div className="space-y-6">
          <div className="bg-blue-900/30 p-3 rounded text-center">
            <label className="block text-[11px] font-bold tracking-wider mb-1 uppercase">REPORT DATE:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white text-slate-900 text-xs font-bold p-1.5 rounded border border-blue-700 outline-none text-center"
            />
          </div>

          <div className="space-y-3">
            <button onClick={fetchReportData} className="w-full bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold py-3 px-2 rounded border border-slate-300 shadow flex flex-col items-center gap-1">
              <span>📋 VIEW REPORT</span>
            </button>
            <button className="w-full bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold py-3 px-2 rounded border border-slate-300 shadow flex flex-col items-center gap-1">
              <span>🖨️ PRINT</span>
            </button>
            <button className="w-full bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold py-3 px-2 rounded border border-slate-300 shadow flex flex-col items-center gap-1">
              <span className="text-emerald-600 font-extrabold">🗂️ EXPORT TO EXCEL</span>
            </button>
          </div>
        </div>
        <div className="text-center text-[10px] text-blue-200 font-semibold pt-3 border-t border-blue-400/30">
          MARIS SYSTEM v2.1
        </div>
      </aside>

      {/* KHU VỰC TRÌNH DIỄN FILE EXCEL BÁO CÁO CHÍNH */}
      <main className="flex-1 p-6 overflow-y-auto">

        {/* THANH ĐIỀU CHỈNH MÃ HÀNG NHANH */}
        <div className="mb-4 max-w-4xl mx-auto flex justify-end gap-2">
          <input
            type="text"
            placeholder="Mã hàng (Product Code)"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded px-3 py-1.5 w-48 outline-none shadow-sm"
          />
          <button onClick={fetchReportData} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded shadow">
            Filter Code
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24 font-mono text-xs text-slate-500 animate-pulse uppercase tracking-wider">
            Loading Spreadsheet Data...
          </div>
        ) : report ? (

          /* TRANG SHEET CHÍNH (GIẢ LẬP KHUNG TRẮNG EXCEL) */
          <div className="max-w-4xl mx-auto bg-white border border-slate-400 p-6 shadow-2xl text-slate-900 font-sans text-xs">

            {/* EXCEL HEADER */}
            <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
              <div className="w-14 h-14 bg-blue-600/10 flex items-center justify-center font-black text-blue-700 border border-blue-200 text-[9px] text-center">
                LAVERGNE
              </div>
              <div className="text-center flex-1">
                <h2 className="text-base font-bold tracking-widest uppercase">MARIS DAILY REPORT</h2>
              </div>
              <div className="w-14"></div>
            </div>

            {/* THÔNG TIN CHUNG */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 font-sans mb-4 text-[11px] pb-2 border-b border-slate-200">
              <div className="flex"><span className="w-28 font-bold text-slate-600">Production date</span> <span className="font-mono font-bold">: {selectedDate}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-600">#H/shift</span> <span className="font-mono font-bold">: 12</span></div>
              <div className="flex"><span className="w-28 font-bold text-slate-600">Material type</span> <span className="font-bold text-blue-700">: {productCode || "S039-20 / PE-AVD2-MB"}</span></div>
              <div className="flex"><span className="w-24 font-bold text-slate-600">Objective</span> <span className="font-bold">: Total</span></div>
            </div>

            {/* BẢNG SỐ LIỆU SẢN XUẤT CHÍNH */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-800 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-800">
                    <th className="border border-slate-400 p-1.5 text-left italic font-serif text-xs">Items Description</th>
                    <th className="border border-slate-400 p-1.5 text-center bg-yellow-100 w-[18%]">Day</th>
                    <th className="border border-slate-400 p-1.5 text-center bg-yellow-100 w-[18%]">Night</th>
                    <th className="border border-slate-400 p-1.5 text-center bg-slate-200 w-[20%] font-black">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono text-center">

                  {/* OPERATOR */}
                  <tr className="font-sans font-bold bg-yellow-50">
                    <td className="border border-slate-400 p-1.5 text-left font-serif font-normal">Operator</td>
                    <td className="border border-slate-400 p-1.5">Suong</td>
                    <td className="border border-slate-400 p-1.5">Quoc</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-100">-</td>
                  </tr>

                  {/* GOOD PRODUCT */}
                  <tr className="font-bold">
                    <td className="border border-slate-400 p-1.5 text-left font-serif font-normal">Net prod: Good product</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'PRODUCTION (KG)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'PRODUCTION (KG)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 text-blue-600 font-black">{getVal('total', 'PRODUCTION (KG)')}</td>
                  </tr>

                  {/* CẤU TRÚC THEO YÊU CẦU: TỔNG DL/NC BAO BỌC CÁC CASE LỖI CON */}
                  <tr className="font-bold bg-slate-50 text-amber-800">
                    <td className="border border-slate-400 p-1.5 text-left font-serif text-slate-900">NC product: DLNC Tổng</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'DL/NC (KG)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'DL/NC (KG)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-100 text-amber-700 font-black">{getVal('total', 'DL/NC (KG)')}</td>
                  </tr>
                  <tr className="text-slate-500 text-[10px]">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">↳ Color</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('day', 'Color')}</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('night', 'Color')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-50">{getDlncCaseVal('total', 'Color')}</td>
                  </tr>
                  <tr className="text-slate-500 text-[10px]">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">↳ Surface</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('day', 'Surface')}</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('night', 'Surface')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-50">{getDlncCaseVal('total', 'Surface')}</td>
                  </tr>
                  <tr className="text-slate-500 text-[10px]">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">↳ Pellets</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('day', 'Pellets')}</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('night', 'Pellets')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-50">{getDlncCaseVal('total', 'Pellets')}</td>
                  </tr>
                  <tr className="text-slate-700 text-[10px] font-semibold">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">↳ Properties</td>
                    <td className="border border-slate-400 p-1 text-amber-600">{getDlncCaseVal('day', 'Properties')}</td>
                    <td className="border border-slate-400 p-1 text-amber-600">{getDlncCaseVal('night', 'Properties')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-50 text-amber-700 font-bold">{getDlncCaseVal('total', 'Properties')}</td>
                  </tr>
                  <tr className="text-slate-500 text-[10px]">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">↳ Others</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('day', 'Others')}</td>
                    <td className="border border-slate-400 p-1">{getDlncCaseVal('night', 'Others')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-50">{getDlncCaseVal('total', 'Others')}</td>
                  </tr>

                  {/* KHỐI PHÂN RÃ PHẾ PHẨM SCRAP */}
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Scrap from: Die</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'SCRAP (KG)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'SCRAP (KG)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 font-bold">{getVal('total', 'SCRAP (KG)')}</td>
                  </tr>
                  <tr className="text-slate-400 text-[10px]">
                    <td className="border border-slate-400 p-1 text-left pl-8 italic font-serif">Screen changer</td>
                    <td className="border border-slate-400 p-1">-</td>
                    <td className="border border-slate-400 p-1">-</td>
                    <td className="border border-slate-400 p-1 bg-slate-50">-</td>
                  </tr>

                  {/* REJECT & PROD BRUT */}
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Reject</td>
                    <td className="border border-slate-400 p-1.5">-</td>
                    <td className="border border-slate-400 p-1.5">-</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50">-</td>
                  </tr>
                  <tr className="font-bold bg-slate-50 border-t-2 border-slate-800">
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Prod brut</td>
                    <td className="border border-slate-400 p-1.5">3355</td>
                    <td className="border border-slate-400 p-1.5">4552</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-200 text-slate-900 font-black">7907</td>
                  </tr>

                  {/* CHỈ SỐ YIELD TRONG KHUNG VÀNG */}
                  <tr className="bg-yellow-300 text-slate-900 font-black border-y border-slate-800">
                    <td className="border border-slate-400 p-1.5 text-left font-serif font-bold">Yield</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'YIELD (%)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'YIELD (%)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-yellow-400">{getVal('total', 'YIELD (%)')}</td>
                  </tr>

                  {/* CÁC CHỈ SỐ ISO VẬN HÀNH KHÁC */}
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Number of kg/h</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'NET/HOUR (KG/HOUR)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'NET/HOUR (KG/HOUR)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 font-bold">{getVal('total', 'NET/HOUR (KG/HOUR)')}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Number of stopping hours (h)</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'STOP TIME (HOUR)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'STOP TIME (HOUR)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 font-bold">{getVal('total', 'STOP TIME (HOUR)')}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">Util.%</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'UTILISATION (%)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'UTILISATION (%)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 font-bold">{getVal('total', 'UTILISATION (%)')}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 p-1.5 text-left font-serif">OEE</td>
                    <td className="border border-slate-400 p-1.5">{getVal('day_shift', 'OEE (%)')}</td>
                    <td className="border border-slate-400 p-1.5">{getVal('night_shift', 'OEE (%)')}</td>
                    <td className="border border-slate-400 p-1.5 bg-slate-50 font-black text-emerald-700">{getVal('total', 'OEE (%)')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ========================================================
                BỔ SUNG BẢNG 1: LOSTS (HAOHỤT) KGS - KHỚP ẢNH 1
               ======================================================== */}
            <div className="mt-5">
              <div className="flex justify-between items-end mb-1 font-sans">
                <span className="font-bold text-xs underline">Losts</span>
                <span className="font-bold text-[10px] text-slate-500 mr-8">Kgs</span>
              </div>
              <table className="w-full border-collapse border border-slate-800 text-[11px] font-mono text-center">
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1 text-left font-sans font-semibold w-[44%]">For Yield</td>
                    <td className="border border-slate-400 p-1 w-[18%]">55</td>
                    <td className="border border-slate-400 p-1 w-[18%]">30</td>
                    <td className="border border-slate-400 p-1 bg-slate-50 font-bold w-[20%]">85</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="border border-slate-400 p-1 text-left font-sans font-semibold">For Disponibility</td>
                    <td className="border border-slate-400 p-1">2.396</td>
                    <td className="border border-slate-400 p-1 text-red-600">-6.207</td>
                    <td className="border border-slate-400 p-1 font-bold">8.534</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PHẦN TEXT LOG COMMENT GIỮA CÁC CA */}
            <div className="mt-5 border border-slate-400 p-3 rounded bg-slate-50 font-sans text-[11px] space-y-3">
              <div>
                <h4 className="font-bold text-xs underline uppercase text-slate-800">DAY SHIFT:</h4>
                <p className="text-slate-400 font-bold text-[10px] mt-0.5"># ORDER CHANGE / TIME FOR THE ORDER CHANGE</p>
                <p className="text-blue-800 font-mono font-bold mt-0.5 pl-2 border-l-2 border-blue-500">{getShiftComment('day') || "\\Clean for order change to PE-AVD2-MB-S9139-1"}</p>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <h4 className="font-bold text-xs underline uppercase text-slate-800">NIGHT SHIFT:</h4>
                <p className="text-slate-400 font-bold text-[10px] mt-0.5"># ORDER CHANGE / TIME FOR THE ORDER CHANGE</p>
                <p className="text-blue-800 font-mono font-bold mt-0.5 pl-2 border-l-2 border-blue-500">{getShiftComment('night') || "\\Clean for order change back to S039-20-S9133-1 to finish the lot"}</p>
              </div>
            </div>

            {/* ========================================================
                BỔ SUNG BẢNG 2: SCRAP MARIS & OUTPUT CAPACITY - KHỚP ẢNH 2
               ======================================================== */}
            <div className="mt-5">
              <table className="w-full border-collapse border border-slate-800 text-[11px] font-mono text-center">
                <thead>
                  <tr className="bg-slate-100 font-sans font-bold border-b border-slate-400 text-[10px]">
                    <th className="border border-slate-400 p-1 text-left font-serif font-normal text-xs w-[44%]">Scrap Maris (KG) :</th>
                    <th className="border border-slate-400 p-1 w-[18%]">DAY SHIFT</th>
                    <th className="border border-slate-400 p-1 w-[18%]">NIGHT SHIFT</th>
                    <th className="border border-slate-400 p-1 w-[20%]">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1 bg-slate-50/30"></td>
                    <td className="border border-slate-400 p-1">55</td>
                    <td className="border border-slate-400 p-1">30</td>
                    <td className="border border-slate-400 p-1 bg-slate-100 font-bold">85</td>
                  </tr>
                  <tr className="font-bold border-t border-slate-700">
                    <td className="border border-slate-400 p-1 text-left font-sans">OUTPUT (KG/HR)</td>
                    <td className="border border-slate-400 p-1 bg-slate-50 font-black text-blue-700 text-xs" colSpan={3}>
                      {getVal('total', 'NET/HOUR (KG/HOUR)', '171')}
                    </td>
                  </tr>
                  <tr className="font-bold bg-yellow-50">
                    <td className="border border-slate-400 p-1 text-left font-sans font-normal">Setting of kg/h</td>
                    <td className="border border-slate-400 p-1 bg-yellow-300 border-amber-400">485</td>
                    <td className="border border-slate-400 p-1 bg-yellow-300 border-amber-400">485</td>
                    <td className="border border-slate-400 p-1 bg-yellow-100">485</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          <div className="text-center py-16 text-slate-500 font-bold border-2 border-dashed border-slate-300 max-w-4xl mx-auto rounded bg-white">
            Vui lòng bấm nút VIEW REPORT để tải dữ liệu cấu trúc hoàn thiện.
          </div>
        )}
      </main>
    </div>
  );
}
