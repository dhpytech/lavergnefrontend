'use client'
import React from 'react';

interface ExcelReportRowProps {
    label: string;
    apiKey: string;
    getVal: (shift: 'day'|'night'|'total', key: string, formatType:'number'|'percent'|'plain'|undefined) => string;
    formatType?: 'number'|'percent'|'plain';
    customRowClass?: string;
    customTotalClas?: string;

}

export default function ExcelReportRow (
    {
        label,
        apiKey,
        getVal,
        formatType = 'number',
        customRowClass = "",
        customTotalClass = ""
    }: ExcelReportRowProps) {
      return (
        <tr className={customRowClass || ""}>
          <td className="border border-slate-400 p-1.5 text-left font-serif">{label}</td>
          <td className="border border-slate-400 p-1.5">{getVal('day', apiKey, formatType)}</td>
          <td className="border border-slate-400 p-1.5">{getVal('night', apiKey, formatType)}</td>
          <td className={`border border-slate-400 p-1.5 ${customTotalClass}`}>
            {getVal('total', apiKey, formatType)}
          </td>
        </tr>
      );
}
