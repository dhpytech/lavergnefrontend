import ProductionTable from "./tables/ProductionTable";
import DowntimeTable from "./tables/DowntimeTable";
import ScrapTable from "./tables/ScrapTable";

const TABLE_MAP: Record<string, any> = {
  "SCRAP": ScrapTable,
  "REJECT": ScrapTable,
  "PRODUCTION": ProductionTable,
  "STOP TIME": DowntimeTable,
};

export default function ModalDispatcher({ label, records }: { label: string; records: any[] }) {
  const key = Object.keys(TABLE_MAP).find(k => label.toUpperCase().includes(k));
  const TableComponent = key ? TABLE_MAP[key] : ProductionTable;

  return <TableComponent records={records} />;
}
