"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, Users, Flag, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'xinchenglong96@gmail.com').split(',');

      if (!session || !session.user.email) {
        setIsAdmin(false);
        alert("접근 권한이 없습니다. (미인증)");
        router.replace("/");
        return;
      }

      if (adminEmails.includes(session.user.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        alert(`접근 권한이 없습니다. [${session.user.email}]은 관리자 계정이 아닙니다.`);
        router.replace("/");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center font-black text-2xl">신원 조회사 진행 중... 🕵️‍♂️</div>;
  }

  if (isAdmin === false) {
    return null; // 리다이렉트 중
  }

  const menuItems = [
    { name: "대시보드", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "회원 관리", path: "/admin/users", icon: <Users size={20} /> },
    { name: "컨텐츠 모더레이션(신고)", path: "/admin/reports", icon: <Flag size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-black tracking-tight text-white mb-1 uppercase">Admin Control</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">WorkLog CMS</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md font-bold transition-all ${isActive ? 'bg-cyan-500 text-slate-900 shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-all">
            <ArrowLeft size={16} /> 사이트 돌아가기
          </Link>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-md transition-all">
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
