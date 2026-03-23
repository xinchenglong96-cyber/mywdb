import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          이용약관 (Terms of Service)
        </h1>
        
        <div className="space-y-8 font-bold text-lg leading-relaxed text-slate-800">
          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">제 1 조 (목적)</h2>
            <p>
              본 약관은 회원이 WorkLog 서비스(이하 "서비스")를 이용함에 있어 관리자와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다. 브루탈리즘 감성의 본 서비스는 가감없는 소통과 투명성을 지향합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">제 2 조 (콘텐츠의 책임)</h2>
            <ul className="list-disc w-full ml-5 space-y-2">
              <li>회원이 서비스 내에 게시한 콘텐츠의 모든 권리와 책임은 해당 회원에게 있습니다.</li>
              <li>욕설, 비방, 도배, 음란물 등 타인에게 불쾌감을 주는 게시글과 미디어는 관리자에 의해 즉각 무통보 삭제될 수 있습니다.</li>
              <li>서비스 내에서 회원 상호 간에 발생하는 분쟁에 관하여 관리자는 어떠한 법적 책임도 지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">제 3 조 (서비스의 보류 및 중지)</h2>
            <p>
              관리자는 NAS 서버의 하드웨어 이슈, 네트워크 오류 통제, 또는 극악의 도커 컨테이너 생태계 붕괴 시 언제든지 서비스를 점검하거나 일시 중지할 수 있으며, 이로 인한 데이터 유실에 대해 책임지지 않습니다. (다만 최선을 다해 복구합니다!)
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black text-black bg-cyan-200 inline-block px-3 py-1 border-2 border-black mb-4">제 4 조 (이용 차단 및 제재)</h2>
            <p>
              타 유저로부터 지속적인 <strong>[신고]</strong>를 받거나 플랫폼 분위기를 저해하는 악성 유저의 경우, 영구적으로 접속 프로필이 블라인드 처리되며 DB 단위에서 접근 권한이 말소될 수 있습니다.
            </p>
          </section>

          <div className="mt-12 bg-slate-100 p-6 border-2 border-black border-dashed text-center">
            이 약관은 2026년 3월 23일부터 효력을 뽐냅니다.
          </div>
        </div>
      </div>
    </div>
  );
}
