'use client';

import { useRouter } from 'next/navigation';
import { ClipboardList, Clock, AlertTriangle, Box, Mail, Users } from 'lucide-react';

const infoItems = [
  { label: 'Item Code', icon: <ClipboardList size={32} />, path: '/info/item-code' },
  { label: 'Stop Time', icon: <Clock size={32} />, path: '/info/stop-time' },
  { label: 'Production Problem', icon: <AlertTriangle size={32} />, path: '/info/problems' },
  { label: 'DLNC Case', icon: <Box size={32} />, path: '/info/dlnc_case' },
  { label: 'Email', icon: <Mail size={32} />, path: '/info/mail' },
  { label: 'Operators', icon: <Users size={32} />, path: '/info/employee' },
];

export default function InformationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-orange-100 px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Information Management</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {infoItems.map((item, index) => (
          <button
            key={index}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="text-blue-600 mb-2">{item.icon}</div>
            <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
