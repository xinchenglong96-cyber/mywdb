"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:users!reports_reporter_id_fkey(nickname, email),
        log:logs!reports_reported_log_id_fkey(content, user_id, users(nickname))
      `)
      .order('created_at', { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const handleResolve = async (id: string) => {
    setConfirmState({
      message: "해당 신고건을 '무시(반려)' 처리하시겠습니까?",
      onConfirm: async () => {
        setConfirmState(null);
        const { error } = await supabase.from('reports').update({ status: 'resolved' }).eq('id', id);
        if (!error) fetchReports();
      }
    });
  };

  const handleDeleteLog = async (logId: string, reportId: string) => {
    setConfirmState({
      message: "해당 문제의 게시글(원문)을 즉시 서버에서 완전 삭제하시겠습니까?",
      onConfirm: async () => {
        setConfirmState(null);
        const { error: logErr } = await supabase.from('logs').delete().eq('id', logId);
        if (!logErr) {
          await supabase.from('reports').update({ status: 'resolved' }).eq('id', reportId);
          setAlertMessage("게시글 파쇄가 완료되었으며 신고가 종료되었습니다.");
          fetchReports();
        }
      }
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">신고 접수 내역 관리</h2>
      <div className="space-y-6">
        {loading ? (
           <p className="text-slate-500 font-bold p-8 text-center text-xl">로딩 중 🕵️‍♂️</p>
        ) : reports.length === 0 ? (
           <p className="text-slate-500 font-bold p-8 bg-white rounded-xl border border-slate-200 text-center">접수된 더러운(?) 내역이 없습니다! 서버가 클린합니다.</p>
        ) : reports.map(r => (
          <div key={r.id} className={`bg-white p-6 rounded-xl border ${r.status === 'pending' ? 'border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-200 opacity-60'} flex flex-col gap-4 transition-all`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-bold rounded-md ${r.status === 'pending' ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {r.status === 'pending' ? '🚨 처리 대기중' : '✅ 종결 (완료)'}
                </span>
                <span className="text-sm font-bold text-slate-500">{new Date(r.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 p-4 border-b md:border-b-0 md:border-r border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">고발자(신고인) 및 사유</p>
                <p className="font-bold text-slate-800 mb-2">{r.reporter?.nickname} <span className="text-slate-400 font-normal">({r.reporter?.email})</span></p>
                <div className="bg-red-50 p-3 rounded border border-red-100 text-red-800 font-medium text-sm">
                  "{r.reason}"
                </div>
              </div>
              
              <div className="bg-white p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">신고당한 원문 (작성자: {r.log?.users?.nickname || '삭제됨'})</p>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 font-medium text-sm h-32 overflow-y-auto whitespace-pre-wrap">
                  {r.log ? r.log.content : <span className="text-red-400 font-bold italic line-through">이미 삭제된 데이터 쪼가리입니다.</span>}
                </div>
              </div>
            </div>

            {r.status === 'pending' && r.log && (
              <div className="flex gap-3 justify-end mt-2">
                <button onClick={() => handleResolve(r.id)} className="bg-slate-800 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-slate-700 transition shadow-sm">무혐의 (반려)</button>
                <button onClick={() => handleDeleteLog(r.reported_log_id, r.id)} className="bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-red-600 transition shadow-sm shadow-red-500/20">원문 삭제 (철퇴 💥)</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom Alert Modal */}
      {alertMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 animate-in fade-in duration-200">
          <div className="bg-red-400 p-8 max-w-sm w-full flex flex-col items-center text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-black">알림</h3>
            <p className="text-xl font-bold mb-8 text-black">{alertMessage}</p>
            <button type="button" onClick={() => setAlertMessage(null)} className="bg-black text-white font-black px-8 py-4 border-2 border-black w-full hover:bg-slate-800 transition-all">확인</button>
          </div>
        </div>
      )}

      {/* Custom Confirm Modal */}
      {confirmState && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 max-w-sm w-full flex flex-col items-center text-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] animate-in zoom-in-95 duration-200">
            <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-black">확인</h3>
            <p className="text-xl font-bold mb-8 text-black">{confirmState.message}</p>
            <div className="flex gap-4 w-full">
              <button type="button" onClick={() => setConfirmState(null)} className="bg-white text-black font-black px-4 py-4 border-4 border-black flex-1 hover:bg-slate-200 transition-all">취소</button>
              <button type="button" onClick={confirmState.onConfirm} className="bg-red-500 text-white font-black px-4 py-4 border-4 border-black flex-1 hover:bg-red-600 transition-all">실행</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
