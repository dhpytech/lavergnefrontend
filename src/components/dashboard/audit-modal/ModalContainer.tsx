// components/dashboard/audit-modals/ModalContainer.tsx

interface Props {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalContainer({ label, onClose, children }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="font-bold text-blue-900 uppercase tracking-wide">Audit Log Detail</h2>
            <p className="text-xs text-gray-500 font-medium">Category: {label}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Nội dung bảng (Bên trong là Dispatcher) */}
        <div className="p-0 overflow-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t bg-gray-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold text-gray-700 transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
