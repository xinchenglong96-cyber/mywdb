"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const handleDeleteUser = async (userId: string, nickname: string) => {
    setConfirmState({
      message: `정말 [${nickname}] 유저를 강제 탈퇴시키고 모든 데이터를 삭제하시겠습니까? (복구 불가)`,
      onConfirm: async () => {
        setConfirmState(null);
        // DB users를 지우면 CASCADE 설정에 의해 작성글(logs), 신고/차단 테이블도 함께 연쇄 폭발(삭제)됩니다.
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (!error) {
          setAlertMessage("해당 유저의 모든 흔적이 파쇄되었습니다.");
          fetchUsers();
        } else {
          setAlertMessage("삭제 실패: " + error.message);
        }
      }
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-slate-800 mb-8 border-b-2 border-slate-200 pb-4">회원 전체 관리</h2>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-bold">닉네임</th>
              <th className="p-4 font-bold">이메일</th>
              <th className="p-4 font-bold">플랫폼 가입일</th>
              <th className="p-4 font-bold w-32 text-center">계정 박탈</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">로딩 중...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500 font-bold">가입한 유저가 없습니다.</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-800">{user.nickname}</td>
                <td className="p-4 text-slate-600 font-medium">{user.email}</td>
                <td className="p-4 text-slate-500 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDeleteUser(user.id, user.nickname)} className="text-xs font-bold bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors">강제 탈퇴</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
