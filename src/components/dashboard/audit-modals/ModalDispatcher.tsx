// components/dashboard/audit-modals/ModalDispatcher.tsx
import ModalContainer from "./ModalContainer";
import ProductionTable from "./tables/ProductionTable";
import DowntimeTable from "./tables/DowntimeTable";
import ScrapTable from "./tables/ScrapTable";

export default function ModalDispatcher({ label, records, isOpen, onClose, globalDates, currentShift }: any) {
  if (!isOpen) return null;

  // ✅ Hàm logic để quyết định bảng nào sẽ được hiển thị
  const renderSelectedTable = () => {
    const title = label?.toUpperCase() || "";

    if (title.includes("PRODUCTION")) {
      return <ProductionTable />;
    }

    if (title.includes("STOP TIME (HOUR)")) {
      return <DowntimeTable />;
    }

    if (title.includes("SCRAP")) {
      return <ScrapTable />;
    }

    // Mặc định trả về Production nếu không khớp cái nào
    return <ProductionTable />;
  };

  return (
    <ModalContainer
      label={label}
      onClose={onClose}
      initialDates={globalDates}
      initialShift={currentShift}
      rawRecords={records}
    >
      {/* ✅ Render bảng động dựa trên label */}
      {renderSelectedTable()}
    </ModalContainer>
  );
}
