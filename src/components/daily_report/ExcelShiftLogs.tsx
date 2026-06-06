"use client";

import React from 'react';

interface LogData {
  stopTimes: Array<{ code: string; hours: number }>;
  problems: string[];
  comments: string[];
}

interface ExcelShiftLogsProps {
  shiftType: 'day' | 'night';
  logs: LogData;
}

export default function ExcelShiftLogs({ shiftType, logs }: ExcelShiftLogsProps) {
  const isDay = shiftType === 'day';
  const titleText = isDay ? "☀️ DAY SHIFT:" : "🌙 NIGHT SHIFT:";
  const titleColor = isDay ? "text-[#0070c0]" : "text-slate-800";

  return (
    <div className="border border-slate-400 rounded p-3 bg-slate-50">
      <div className={`text-xs font-black ${titleColor} tracking-wider uppercase border-b border-slate-300 pb-1 mb-2`}>
        {titleText}
      </div>

      {/* 1. StopTime Group */}
      <div className="mb-2">
        <div className="font-bold text-slate-700 font-serif">StopTime:</div>
        <div className="pl-3 font-mono mt-0.5 space-y-0.5 text-slate-900">
          {logs.stopTimes.length > 0 ? (
            logs.stopTimes.map((st, i) => (
              <div key={i}>• {st.code}: <span className="font-bold text-red-700">{st.hours.toFixed(2)}h</span></div>
            ))
          ) : (
            <div className="text-slate-400 italic text-[10px]">No StopTime logged</div>
          )}
        </div>
      </div>

      {/* 2. Problems Group */}
      <div className="mb-2">
        <div className="font-bold text-slate-700 font-serif">Problems:</div>
        <div className="pl-3 mt-0.5 space-y-0.5 text-slate-900">
          {logs.problems.length > 0 ? (
            logs.problems.map((pr, i) => (
              <div key={i} className="font-medium">• {pr}</div>
            ))
          ) : (
            <div className="text-slate-500 italic text-[10px]">No Problems</div>
          )}
        </div>
      </div>

      {/* 3. Comments Group */}
      <div>
        <div className="font-bold text-slate-700 font-serif">Comments:</div>
        <div className="pl-3 mt-0.5 space-y-0.5 text-blue-900 font-sans">
          {logs.comments.length > 0 ? (
            logs.comments.map((cm, i) => (
              <div key={i} className="whitespace-pre-wrap leading-relaxed">• {cm}</div>
            ))
          ) : (
            <div className="text-slate-400 italic text-[10px]">No Comment</div>
          )}
        </div>
      </div>
    </div>
  );
}