"use client";
import { useMemo } from 'react';
import { StatMiniCard } from '../StatMiniCard';

interface Props {
  data: any;
  activeEmp: string;
}

export const EmployeeStatCards = ({ data, activeEmp }: Props) => {
  const stats = useMemo(() => {
    if (!data || !activeEmp) return null;
    const months = Object.keys(data).sort();

    const prodSeries = months.map(m => data[m].DETAILS?.[activeEmp]?.prod ?? 0);
    const scrapSeries = months.map(m => data[m].DETAILS?.[activeEmp]?.scrap ?? 0);
    const totalProd = prodSeries.reduce((a, b) => a + b, 0);
    const totalScrap = scrapSeries.reduce((a, b) => a + b, 0);

    return {
      prod: { total: totalProd, series: prodSeries },
      scrap: { total: totalScrap, series: scrapSeries },
      eff: {
        avg: totalProd > 0 ? ((totalProd - totalScrap) / totalProd * 100).toFixed(2) : 0,
        series: months.map(m => {
          const e = data[m].DETAILS?.[activeEmp];
          return e?.prod > 0 ? ((e.prod - e.scrap) / e.prod * 100) : 0;
        })
      }
    };
  }, [data, activeEmp]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatMiniCard title="Sản Lượng Cá Nhân" value={stats.prod.total} unit="KG" color="#3b82f6" chartData={stats.prod.series} />
      <StatMiniCard title="Phế Phẩm Cá Nhân" value={stats.scrap.total} unit="KG" color="#ef4444" chartData={stats.scrap.series} />
      <StatMiniCard title="Hiệu Suất TB" value={stats.eff.avg} unit="%" color="#10b981" chartData={stats.eff.series} />
    </div>
  );
};
