'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell, Info, Keyboard, ChartNoAxesCombined, FileSliders,} from 'lucide-react';

const menu = [
  { label: 'INFORMATION', path: '/info/main' , icon: Info, color: 'text-blue-600'  },
  { label: 'DATA INPUT', path: '/input/main', icon: Keyboard, color: 'text-green-600'  },
  { label: 'DASHBOARD', path: '/dashboard/main', icon: ChartNoAxesCombined, color: 'text-yellow-600'  },
  { label: 'EXPORT FILE', path: '/isofile' , icon: FileSliders, color: 'text-violet-600'  },
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
        <Link href="../user/home">
          <div className="flex items-center gap-3">
            <img
              src="/lavergne.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="text-white font-bold text-lg">LAVERGNE VN</span>
          </div>
        </Link>
        {/* Menu Buttons */}
        <nav className="flex-1 mx-6">
          <ul className="flex flex-wrap gap-2 justify-center">
            {menu.map((item) => {
              const Icon = item.icon; // 👈 Quan trọng
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md border text-sm font-medium shadow-sm ${
                      pathname === item.path
                        ? 'bg-white text-sky-700 font-semibold'
                        : 'bg-sky-100 text-sky-800 hover:bg-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
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
      <main className="flex-1 p-6 " style={{backgroundImage:"url('/BG A LE.png')",backgroundSize:"100% 100%",backgroundRepeat:"no-repeat",}}>{children}</main>
    </div>
  );
}
