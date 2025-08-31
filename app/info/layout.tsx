'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react'; // icon chuông thông báo

const menu = [
  { label: 'Information', path: '/info/main' },
  { label: 'Maris Input', path: '/input/maris' },
  { label: 'Bagging Input', path: '/input/bagging' },
  { label: 'Metal Input', path: '/input/metal' },
  { label: 'Maris DB', path: '/dashboard/maris-db' },
  { label: 'Bagging DB', path: '/dashboard/bagging-db' },
  { label: 'Metal DB', path: '/dashboard/metal-db' },
  { label: 'IsoFile', path: '/isofile' },
];

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const handleLogout = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/token/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    router.push('./login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full bg-sky-300 shadow-md flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <img
            src="/lavergne.png"
            alt="Logo"
            className="h-10 w-auto"
          />
          <span className="text-white font-bold text-lg">LAVERGNE VN</span>
        </div>

        {/* Menu Buttons */}
        <nav className="flex-1 mx-6">
          <ul className="flex flex-wrap gap-2 justify-center">
            {menu.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-3 py-1 rounded-md border text-sm font-medium shadow-sm ${
                    pathname === item.path
                      ? 'bg-white text-sky-700 font-semibold'
                      : 'bg-sky-100 text-sky-800 hover:bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="flex items-center gap-3">
          {/*<Bell className="text-white w-5 h-5"/>*/}
          <span className="text-white text-sm hidden md:inline">Welcome Lavergne Group</span>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              {username ? username[0].toUpperCase() : '?'}
            </div>
            <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="text-xs text-white underline hover:text-red-200"
            >
              Thoát
            </button>
          </div>

        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6 " style={{backgroundImage:"url('/bg-welcome.jpg')" }}>{children}</main>
    </div>
  );
}
