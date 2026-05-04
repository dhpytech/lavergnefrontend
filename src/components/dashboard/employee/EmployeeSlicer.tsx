"use client";

interface Props {
  employees: string[];
  selectedEmps: string[];
  onEmpChange: (emps: string[]) => void;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

export const EmployeeHeader = ({
  employees, selectedEmps, onEmpChange, startDate, endDate, onDateChange
}: Props) => {

  const toggleEmp = (name: string) => {
    const updated = selectedEmps.includes(name)
      ? selectedEmps.filter(n => n !== name)
      : [...selectedEmps, name];
    onEmpChange(updated);
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Phân tích nhân sự</h1>

        {/* Lọc tháng giống Maris Trendline */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 px-4 rounded-2xl border border-slate-100">
          <input
            type="month" value={startDate}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            className="bg-transparent border-none text-sm font-bold outline-none text-slate-700"
          />
          <span className="text-slate-300 font-bold">→</span>
          <input
            type="month" value={endDate}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            className="bg-transparent border-none text-sm font-bold outline-none text-slate-700"
          />
        </div>
      </div>

      {/* Slicer Nhân viên (Dạng Chips) */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
        {employees.map(name => (
          <button
            key={name}
            onClick={() => toggleEmp(name)}
            className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all border ${
              selectedEmps.includes(name)
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
