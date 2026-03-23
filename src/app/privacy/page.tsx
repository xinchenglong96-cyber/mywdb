import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const brutalBorder = "border-4 border-black !rounded-none";
  const brutalShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:translate-x-[2px] hover:translate-y-[2px] transition-all";

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 font-sans text-black relative items-center py-20 px-4" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '30px 30px' }}>
      <div className={`w-full max-w-4xl bg-white p-8 sm:p-12 ${brutalBorder} ${brutalShadow}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-8 bg-yellow-300 px-4 py-2 text-lg font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${brutalActive}`}>
          <ArrowLeft className="h-6 w-6 stroke-[3px]" /> 피드로 돌아가기
        </Link>
        
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-10 bg-black text-white inline-block px-4 py-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
          개인정보처리방침 (Privacy Policy)
        </h1>
        
        <div className="space-y-8 font-bold text-lg leading-relaxed text-slate-800">
          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">1. 수집하는 개인정보의 항목</h2>
            <p>
              WorkLog 서비스는 구글 OAuth 로그인(Supabase Auth 연동)을 통해 회원가입 시 아래의 필수적인 개인정보만을 안전하게 가져옵니다.
            </p>
            <ul className="list-disc w-full ml-5 mt-2 space-y-1">
              <li><strong>이메일 주소</strong> (계정 식별용)</li>
              <li><strong>구글 닉네임 혹은 이름</strong> (화면 표시용)</li>
              <li><strong>구글 아바타 사진 URL</strong> (프로필 사진 노출용)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">2. 개인정보의 보유 및 안전한 처리</h2>
            <p>
              고객님의 데이터는 외부 클라우드 업체(Vercel, AWS 등)에 저장되는 것이 아니라, 철통 방어된 <strong>개인용 NAS 장비의 최고급 도커(Docker) 컨테이너 격리망 내부 데이터베이스</strong>에 직접 소중히 보관됩니다. 탈퇴 즉시 모든 흔적은 즉각 `CASCADE` 파쇄되어 삭제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">3. 쿠키(Cookie) 및 세션 사용</h2>
            <p>
              앱은 당신이 로그인된 상태임을 기억하기 위해 브라우저의 `LocalStorage`에 보안 토큰(JWT)을 저장합니다. 이것을 제3자에게 뺏기지 않도록 관리할 의무는 유저 본인에게 있으며, 공용 PC 사용 후에는 반드시 시원하게 **[로그아웃]** 버튼을 내리쳐 주시기 바랍니다.
            </p>
          </section>
          
          <div className="mt-12 bg-slate-100 p-6 border-2 border-black border-dashed text-center">
            본 방침은 2026년 3월 23일부터 강력하게 적용됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
