interface StatCardProps {
  label: string;
  value: string;
  lastMonth: string;
  lastYear: string;
  onClick: () => void;
}

export const StatCard = ({ label, value, lastMonth, lastYear, onClick }: StatCardProps) => {
  const getStatusColor = (val: string) => {
    if (val.startsWith('+')) return 'text-green-600';
    if (val.startsWith('-')) return 'text-red-600';
    return 'text-slate-400';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
    >
      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">{label}</h4>
      <p className="text-2xl font-black text-slate-800 my-1">{value}</p>

      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-50 text-[9px]">
        <div>
          <span className="text-slate-400 block italic">vs LM</span>
          <span className={`font-bold ${getStatusColor(lastMonth)}`}>{lastMonth}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block italic">vs LY</span>
          <span className={`font-bold ${getStatusColor(lastYear)}`}>{lastYear}</span>
        </div>
      </div>
    </div>
  );
};
