export const EmployeeMetricCard = ({ config, totalValue, trendData, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase">{config.label}</p>
          <h3 className="text-xl font-bold text-slate-800">{totalValue} {config.unit}</h3>
        </div>
      </div>
      {/* Mini Trend Chart giống Maris */}
      <div className="h-10 w-full">
         <MiniTrendChart data={trendData} color={isActive ? '#3b82f6' : '#cbd5e1'} />
      </div>
    </div>
  );
};
