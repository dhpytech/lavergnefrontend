'use client';

import { useRouter } from 'next/navigation';
import { ClipboardList, Clock, AlertTriangle, Box, Mail, Users } from 'lucide-react';

const infoItems = [
  { label: 'MARIS DASHBOARD', icon: <ClipboardList size={32} />, path: '/dashboard/form-db' },
  { label: 'BAGGING DASHBOARD', icon: <ClipboardList size={32} />, path: '/dashboard/bagging-db' },
  { label: 'METAL DASHBOARD', icon: <ClipboardList size={32} />, path: '/dashboard/metal-db' },
];

export default function InformationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-orange-100 px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">VIEW DASHBOARDS</h1>

        <div className="grid grid-cols-3 flex gap-6">
            {infoItems.map((item, index) => (
                <button
                    key={index}
                    onClick={() => router.push(item.path)}
                    className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                >
                    <div className="text-blue-600 mb-2">{item.icon}</div>
                    <span className="text-sm font-medium text-gray-700 text-center">{item.label}</span>
                </button>
            ))} <br/>
        </div>
    </div>
  );
}
