"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Users, FileText, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, logs: 0, reports: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [usersRes, logsRes, reportsRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('logs').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      ]);

      setStats({
        users: usersRes.count || 0,
        logs: logsRes.count || 0,
        reports: reportsRes.count || 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">대시보드 요약</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg"><Users size={32} /></div>
          <div>
            <p className="text-sm font-bold text-slate-500">총 가입 유저</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.users}명</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-lg"><FileText size={32} /></div>
          <div>
            <p className="text-sm font-bold text-slate-500">누적 게시물</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.logs}개</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={32} /></div>
          <div>
            <p className="text-sm font-bold text-slate-500">처리 대기중인 신고</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : stats.reports}건</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
