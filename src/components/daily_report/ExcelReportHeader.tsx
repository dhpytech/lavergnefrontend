'use client'
import React from "react";

export default function ExcelReportHeader() {
    return (
    <div className="border-b-2 border-slate-900 pb-2 mb-4 flex justify-between items-center">
      <div className="w-20 h-14 relative flex items-center justify-center">
        <img src="/lavergne.png" alt="Lavergne Logo" className="max-w-full max-h-full object-contain p-1" />
      </div>
      <h2 className="text-base font-bold tracking-widest text-center flex-1 uppercase">
        MARIS DAILY REPORT
      </h2>
      <div className="w-14"></div>
    </div>
  );
}
