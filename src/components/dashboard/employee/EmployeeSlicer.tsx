"use client";

interface Props {
  employees: string[];
  activeEmps: string[];
  onEmpsChange: (names: string[]) => void;
}

export const EmployeeSlicer = ({ employees, activeEmps, onEmpsChange }: Props) => {
  const toggleEmployee = (name: string) => {
    if (activeEmps.includes(name)) {
      // Nếu đã chọn rồi thì bỏ chọn, nhưng giữ lại ít nhất 1 người
      if (activeEmps.length > 1) {
        onEmpsChange(activeEmps.filter(emp => emp !== name));
      }
    } else {
      onEmpsChange([...activeEmps, name]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
      {employees.map((emp) => (
        <button
          key={emp}
          onClick={() => toggleEmployee(emp)}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all border ${
            activeEmps.includes(emp)
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-white border-slate-200 text-slate-400 hover:border-blue-400'
          }`}
        >
          {emp}
        </button>
      ))}
    </div>
  );
};
