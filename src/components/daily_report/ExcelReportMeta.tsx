'use client'

import React from 'react';

interface ExcelReportMetaProps {
    selectedDate: string;
    productCodes: string;
}

export default function ExcelReportMeta (
    {
        selectedDate, productCodes,
    } : ExcelReportMetaProps )  {
        return (
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 font-sans mb-4 text-[11px] pb-2 border-b border-slate-200">
              <div className="flex">
                <span className="w-28 font-bold text-slate-600">Production date</span>
                <span className="font-bold text-blue-600 pl-8">: {selectedDate}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-slate-600">#H/shift</span>
                <span className="font-bold text-blue-600 pl-2">: 12</span>
              </div>
              <div className="flex">
                <span className="w-28 font-bold text-slate-600">Material type</span>
                <span className="font-bold text-blue-600 pl-8">: {productCodes}</span>
              </div>
              <div className="flex">
                <span className="w-24 font-bold text-slate-600">Objective</span>
                <span className="font-bold text-blue-600 pl-2">: Total</span>
              </div>
            </div>
          );
}