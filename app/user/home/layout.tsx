'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const menu = [
  {
    title: 'Input Data',
    items: ['maris', 'bagging', 'metal'],
    path: '../input',
  },
  {
    title: 'Dashboard',
    items: ['maris-db', 'bagging-db', 'metal-db'],
    path: '../dashboard',
  },
  {
    title: 'IsoFile',
    items: [],
    path: '../isofile',
  },
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
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        {/* User section lên đầu */}
        <div className="border-b p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {username ? username[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{username || 'Guest'}</p>
              <p className="text-xs text-gray-500">Người dùng</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
            title="Đăng xuất"
          >
            Thoát
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-4 flex-1 overflow-auto">
          {menu.map((group) => (
            <div key={group.title}>
              <p className="text-sm font-semibold text-gray-500 mb-2">{group.title}</p>
              <ul className="space-y-1">
                {group.items.length > 0 ? (
                  group.items.map((item) => {
                    const href = `/home/${group.path}/${item}`;
                    const isActive = pathname === href;

                    return (
                      <li key={item}>
                        <Link
                          href={href}
                          className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item[0].toUpperCase() + item.slice(1)}
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li>
                    <Link
                      href={`/home/${group.path}`}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                        pathname === `/home/${group.path}`
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {group.title}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
