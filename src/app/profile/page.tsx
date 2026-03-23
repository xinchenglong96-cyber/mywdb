import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Home, Compass, Bell, User, PenSquare } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  const brutalBorder = "border-2 border-black !rounded-none"
  const cardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  const cardBorder = "border-4 border-black !rounded-none"

  return (
    <div className="flex min-h-screen bg-pink-50 font-sans text-black">
      {/* Sidebar Navigation */}
      <aside className={`fixed hidden w-64 flex-col bg-green-200 px-4 py-8 sm:flex h-full ${cardBorder} border-y-0 border-l-0 border-r-4 z-10`}>
        <div className="mb-8 px-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter shadow-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">WorkLog</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-4 mt-8">
          <Button asChild variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-white ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Link href="/"><Home className="h-6 w-6 stroke-[3px]" /> 피드</Link>
          </Button>
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-white ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Compass className="h-6 w-6 stroke-[3px]" /> 탐색
          </Button>
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-white ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Bell className="h-6 w-6 stroke-[3px]" /> 알림
          </Button>
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-yellow-300 ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <User className="h-6 w-6 stroke-[3px]" /> 프로필
          </Button>
        </nav>
        <div className="mt-auto pt-4 border-t-4 border-black border-dashed">
          <div className="flex items-center gap-3 px-2 py-4 mb-4">
            <Avatar className={`h-12 w-12 ${brutalBorder}`}>
              <AvatarFallback className="bg-orange-400 font-bold text-black border-2 border-black">나</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-black uppercase">Me</span>
              <span className="text-xs font-bold text-slate-800">개발하는 라이언</span>
            </div>
          </div>
          <Button className={`w-full gap-2 font-black text-lg py-6 bg-red-400 text-black hover:bg-red-500 hover:text-black ${brutalBorder} ${brutalShadow} ${brutalActive}`} size="lg">
            <PenSquare className="h-6 w-6 stroke-[3]" /> 새 작업 기록
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-64 bg-slate-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          
          {/* Profile Header Card */}
          <Card className={`mb-12 bg-white ${cardBorder} ${cardShadow}`}>
            <CardHeader className="flex flex-row items-center gap-6 pb-6 border-b-4 border-black bg-cyan-200">
              <Avatar className={`h-24 w-24 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <AvatarFallback className="bg-orange-400 text-3xl font-black text-black">나</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-4xl font-black text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">개발하는 라이언</h2>
                <p className="text-lg font-bold text-slate-800 mt-2 bg-white px-2 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">프론트엔드 / 인터랙티브 웹 디자인 관심 ✨</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex gap-6">
              <div className={`flex flex-col items-center bg-yellow-300 px-6 py-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <span className="text-3xl font-black">5</span>
                <span className="text-sm font-bold uppercase">Projects</span>
              </div>
              <div className={`flex flex-col items-center bg-pink-300 px-6 py-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <span className="text-3xl font-black">27</span>
                <span className="text-sm font-bold uppercase">Logs</span>
              </div>
              <div className={`flex flex-col items-center bg-green-300 px-6 py-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <span className="text-3xl font-black">128</span>
                <span className="text-sm font-bold uppercase">Cheered</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Section */}
          <div className="mb-12">
            <h3 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-black inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
              PROJECT TIMELINE
            </h3>

            {/* Timeline Wrapper */}
            <div className="relative pl-8 border-l-8 border-black space-y-12 pb-8 ml-4">
              
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-[52px] top-6 h-8 w-8 bg-yellow-400 border-4 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 flex items-center justify-center">
                  <div className="h-3 w-3 bg-black"></div>
                </div>
                <Card className={`bg-blue-200 ${cardBorder} ${cardShadow} relative`}>
                  <div className="absolute top-4 -left-[32px] w-[32px] h-2 bg-black"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-black mb-1 bg-white px-2 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-black hover:text-white transition-colors">Web3 SNS 웹 클론</h4>
                        <p className="text-sm font-bold text-slate-800 mt-2">최종 업데이트: 2시간 전</p>
                      </div>
                      <span className={`bg-green-400 px-3 py-1 text-sm font-black border-2 border-black`}>진행중 🏃‍♂️</span>
                    </div>
                    <div className={`bg-white p-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <span className="font-black text-blue-600 block mb-2">최근 작업 로그:</span>
                      <p className="font-bold text-black">오늘은 네오 브루탈리즘 디자인을 연습해봤어요! 그림자와 굵은 테두리가 매력적이네요.</p>
                      <Button className={`mt-4 bg-black text-white ${brutalBorder} hover:bg-black font-bold active:translate-y-[2px] active:translate-x-[2px]`}>
                        해당 로그 보러가기 →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-[52px] top-6 h-8 w-8 bg-white border-4 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 flex items-center justify-center">
                  <div className="h-3 w-3 bg-slate-400"></div>
                </div>
                <Card className={`bg-slate-200 ${cardBorder} ${cardShadow} relative opacity-90`}>
                  <div className="absolute top-4 -left-[32px] w-[32px] h-2 bg-black"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-2xl font-black mb-1 bg-white px-2 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-500 line-through decoration-4">알고리즘 스터디 모음집</h4>
                        <p className="text-sm font-bold text-slate-600 mt-2">최종 업데이트: 2개월 전</p>
                      </div>
                      <span className={`bg-slate-400 text-white px-3 py-1 text-sm font-black border-2 border-black`}>완료 🏁</span>
                    </div>
                    <div className={`bg-white p-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                      <span className="font-black text-slate-600 block mb-2">최종 회고:</span>
                      <p className="font-bold text-slate-800">10주간의 백준 알고리즘 박살내기 스터디가 무사히 종료되었습니다. 모두 수고하셨습니다!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
