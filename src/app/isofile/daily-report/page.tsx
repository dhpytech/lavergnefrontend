"use client";

import React, { useState, useEffect, useRef } from 'react';
import ExcelReportRow from '@/src/components/daily_report/ExcelReportRow';
import ExcelReportHeader from '@/src/components/daily_report/ExcelReportHeader';
import ExcelReportMeta from '@/src/components/daily_report/ExcelReportMeta';
import ExcelShiftLogs from '@/src/components/daily_report/ExcelShiftLogs';

import {getValReport, getActiveDlncCasesReport, getDlncShiftValReport, getAggregatedLogsByShiftReport, exportToExcel, exportToImage,
    generatePdfBase64,
} from '@/src/components/daily_report/report_utils';

export default function MarisExcelDailyReport() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-28');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://gunicorn-lavergnebackendwsgi-production.up.railway.app';
      const url = `${BASE_URL}/entries/daily-report/?date=${selectedDate}`;
      const res = await fetch(url);
      if (res.ok) {
        const jsonRes = await res.json();
        if (jsonRes.success) setReport(jsonRes.data);
      }
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReportData(); }, [selectedDate]);

  const getVal = (shift: 'day' | 'night' | 'total', key: string, formatType?: 'number' | 'percent' | 'plain', fallback?: string) => {
      return getValReport(report, shift, key, formatType, fallback);
    };

  const getActiveDlncCases = () => getActiveDlncCasesReport(report);

  const getDlncShiftVal = (shift: 'day' | 'night' | 'total', caseName: string) => {
    return getDlncShiftValReport(report,shift,caseName);
  };

  const getAggregatedLogsByShift = (shiftName: 'day' | 'night') => getAggregatedLogsByShiftReport(report, shiftName);

  const activeDlncCases = getActiveDlncCases();
  const dayLogs = getAggregatedLogsByShift('day');
  const nightLogs = getAggregatedLogsByShift('night');

  const sidebarButtons = [
    {
      label: "VIEW REPORT", onClick: fetchReportData, icon: "📋",
      customClass: "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100"
    },
    {
      label: "EXPORT EXCEL", onClick: () => exportToExcel("main", selectedDate), icon: "📊",
      customClass: "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
    },
    {
      label: "EXPORT PDF",
      onClick: async () => {
        if (!reportRef.current) return;
        setLoading(true);
        const base64 = await generatePdfBase64(reportRef.current);
        if (base64) {
          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${base64}`;
          link.download = `Maris_Production_Report_${selectedDate}.pdf`;
          link.click();
        }
        setLoading(false);
      },
      icon: "📄",
      customClass: "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
    },
    {
      label: "EXPORT IMAGE", onClick: () =>exportToImage(reportRef.current,selectedDate), icon: "🖼️",
      customClass: "bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
    },
    {
      label: "SEND EMAIL", onClick: () =>{}, icon: "✉️",
      customClass: "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
    },
  ];

  const baseButtonStyle = "w-full text-[11px] font-bold py-3 px-2 rounded border shadow flex flex-col " +
      "items-center gap-1 transition-all active:scale-[0.98]";

  return (
    <div className="flex min-h-screen bg-slate-200 text-slate-900 font-sans antialiased">
      <aside className="w-60 bg-slate-400 text-white flex flex-col justify-between shrink-0 p-4 shadow-xl">
        <div className="space-y-6">
            <label className=" block text-[14px] font-bold tracking-wider ml-1 mb-1 uppercase text-left text-blue-800">REPORT
              DATE:</label>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white text-slate-900 text-xs font-bold p-3 rounded border border-blue-700 outline-none text-right"
            />

          {sidebarButtons.map((btn, index) => (
            <button
              key={index}
              onClick={btn.onClick}
              className={`${baseButtonStyle} ${btn.customClass}`}
            >
              <span>{btn.icon} {btn.label}</span>
            </button>
          ))}
        </div>

      </aside>


      <main className="flex-1 p-6 overflow-y-auto">
        {loading ? (
            <div className="text-center py-24 font-mono text-xs text-slate-500 animate-pulse uppercase tracking-wider">Loading...</div>
        ) : report ? (
            <div
                ref={reportRef}
                className="max-w-4xl mx-auto bg-white border border-slate-400 p-6 shadow-2xl text-slate-900 font-sans text-xs">
              <ExcelReportHeader/>
              <ExcelReportMeta selectedDate={selectedDate} productCodes={getVal('total', 'product_codes', 'plain')}/>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-800 text-[11px]">
                  <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-800">
                    <th className="border border-slate-400 p-1.5 text-left italic font-serif text-xs">Items
                      Description
                    </th>
                    <th className="border border-slate-400 p-1.5 text-center w-[18%]">Day</th>
                    <th className="border border-slate-400 p-1.5 text-center w-[18%]">Night</th>
                    <th className="border border-slate-400 p-1.5 text-center w-[20%]">Total</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 font-mono text-center">
                  <ExcelReportRow label="Operator" apiKey="employees" getVal={getVal} formatType="plain"/>
                  <ExcelReportRow label="Product Code" apiKey="product_codes" getVal={getVal} formatType="plain"/>
                  <ExcelReportRow label="Net prod: Good product" apiKey="goodPro" getVal={getVal}/>

                  <ExcelReportRow label="TOTAL DLNC" apiKey="dlnc" getVal={getVal}
                                  customRowClass="font-bold bg-slate-200 text-amber-800"
                                  customTotalClass="text-amber-700"/>

                  {activeDlncCases.length > 0 ? (
                      activeDlncCases.map((caseName) => (
                          <tr key={caseName} className="text-slate-500 text-[10px]">
                            <td className="border border-slate-400 p-1 text-left pl-4 italic font-serif">- {caseName}</td>
                            <td className="border border-slate-400 p-1">{getDlncShiftVal('day', caseName)}</td>
                            <td className="border border-slate-400 p-1">{getDlncShiftVal('night', caseName)}</td>
                            <td className="border border-slate-400 p-1 font-bold text-slate-800">{getDlncShiftVal('total', caseName)}</td>
                          </tr>
                      ))
                  ) : (
                      <tr className="text-slate-400 text-[10px] italic bg-slate-50/30">
                        <td colSpan={4}
                            className="border border-slate-400 p-1.5 text-center text-slate-500 tracking-wider">
                          - No Dlnc Case -
                        </td>
                      </tr>
                  )}

                  <ExcelReportRow label="TOTAL SCRAP" apiKey="scrap" getVal={getVal}
                                  customRowClass="font-bold bg-slate-200 text-amber-800" customTotalClass="font-bold"/>
                  <ExcelReportRow label="Scrap from Die" apiKey="scrapDie" getVal={getVal}
                                  customTotalClass="font-bold"/>
                  <ExcelReportRow label="Scrap from Screen Changer" apiKey="screen" getVal={getVal}
                                  customTotalClass="font-bold"/>
                  <ExcelReportRow label="Reject" apiKey="reject" getVal={getVal} customTotalClass="font-bold"/>

                  <ExcelReportRow label="PROD BRUT" apiKey="output" getVal={getVal}
                                  customRowClass="font-bold bg-[#FEF08A] text-amber-800"
                                  customTotalClass="text-amber-700"/>
                  <ExcelReportRow label="Yield" apiKey="yield_pct" getVal={getVal} formatType="percent"
                                  customRowClass="text-slate-900 font-black border-y border-slate-800 font-bold"/>

                  <ExcelReportRow label="Number of kg/h" apiKey="net_hr" getVal={getVal} customTotalClass="font-bold"/>
                  <ExcelReportRow label="Number of stopping hours (h)" apiKey="stop_hr" getVal={getVal}
                                  customTotalClass="bg-slate-50 font-bold"/>
                  <ExcelReportRow label="Util.%" apiKey="used_pct" getVal={getVal} formatType="percent"
                                  customTotalClass="bg-slate-50 font-bold"/>
                  {/*<ExcelReportRow label="Rate" apiKey="rate" getVal={getVal} formatType="number" customTotalClass="bg-slate-50 font-bold" />*/}
                  <ExcelReportRow label="OEE" apiKey="oee_pct" getVal={getVal} formatType="percent"
                                  customTotalClass="bg-slate-50 font-black text-emerald-700"/>

                  <ExcelReportRow label="Screw rejections SLAB" apiKey="visslab" getVal={getVal} formatType="number"
                                  customTotalClass="bg-slate-50 font-black text-emerald-700"/>
                  <ExcelReportRow label="% Screw rejections SLAB" apiKey="visslabPercent" getVal={getVal}
                                  formatType="percent" customTotalClass="bg-slate-50 font-black text-emerald-700"/>
                  </tbody>
                </table>
              </div>

              {/* BẢNG LOSTS KGS */}
              <div className="overflow-x-auto mt-5">
                <table className="w-full border-collapse border border-slate-50 text-[11px]">
                  <thead>
                  <tr className="text-slate-800 font-bold border-b border-slate-50">
                    <th className="p-1.5 text-left italic font-serif text-xs">Losts
                    </th>
                    <th className="w-[18%]"></th>
                    <th className="w-[18%]"></th>
                    <th className="w-[20%]"></th>
                  </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-300 font-mono text-center">
                  <ExcelReportRow label="For Yield" apiKey="scrap" getVal={getVal} customTotalClass="bg-slate-50 font-bold" />
                  <ExcelReportRow label="For Disponibility" apiKey="lost_disp" getVal={getVal} customRowClass="bg-slate-50/50" customTotalClass="font-bold"/>
                  </tbody>
                </table>
              </div>

              {/* 🛠️ 3. LOG CHI TIẾT SỰ CỐ THEO CA COMPONENT */}
              <div className="mt-5 space-y-4 font-sans text-[11px]">
                <ExcelShiftLogs shiftType="day" logs={dayLogs}/>
                <ExcelShiftLogs shiftType="night" logs={nightLogs}/>
              </div>

              {/* SCRAP MARIS & OUTPUT CAPACITY */}
              <div className="mt-5">
                <table className="w-full border-collapse border border-slate-800 text-[11px] font-mono text-center">
                  <thead>
                  <tr className="bg-slate-100 font-sans font-bold border-b border-slate-400 text-[10px]">
                    <th className="border border-slate-400 p-1 text-left font-serif font-normal text-xs w-[44%]">Scrap
                      Maris (KG) :
                    </th>
                    <th className="border border-slate-400 p-1 w-[18%]">DAY SHIFT</th>
                    <th className="border border-slate-400 p-1 w-[18%]">NIGHT SHIFT</th>
                    <th className="border border-slate-400 p-1 w-[20%]">TOTAL</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className="border border-slate-400 p-1 bg-slate-50/30"></td>
                    <td className="border border-slate-400 p-1">{getVal('day', 'scrap')}</td>
                    <td className="border border-slate-400 p-1">{getVal('night', 'scrap')}</td>
                    <td className="border border-slate-400 p-1 bg-slate-100 font-bold">{getVal('total', 'scrap')}</td>
                  </tr>
                  <tr className="font-bold border-t border-slate-700">
                    <td className="border border-slate-400 p-1 text-left font-sans">OUTPUT (KG/HR)</td>
                    <td className="border border-slate-400 p-1 bg-slate-50 font-black text-blue-700 text-xs"
                        colSpan={3}>{getVal('total', 'net_hr')}</td>
                  </tr>
                  <tr className="font-bold bg-yellow-50">
                    <td className="border border-slate-400 p-1 text-left font-sans font-normal">Setting of kg/h</td>
                    <td className="border border-slate-400 p-1 bg-yellow-300 border-amber-400">{getVal('day', 'setting_kgh', 'plain')}</td>
                    <td className="border border-slate-400 p-1 bg-yellow-300 border-amber-400">{getVal('night', 'setting_kgh', 'plain')}</td>
                    <td className="border border-slate-400 p-1 bg-yellow-100">{getVal('total', 'setting_kgh', 'plain')}</td>
                  </tr>
                  </tbody>
                </table>
              </div>

            </div>
        ) : (
            <div
                className="text-center py-16 text-slate-500 font-bold border-2 border-dashed border-slate-300 max-w-4xl mx-auto rounded bg-white">
              Vui lòng chọn ngày để tải dữ liệu cấu trúc hoàn thiện.
            </div>
        )}
      </main>
    </div>
  );
}
