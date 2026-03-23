"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      }
    });

    if (error) {
      console.error(error);
      setError("구글 로그인 연동 중 오류가 발생했습니다. 개발자 권한을 확인해주세요.");
      setIsLoading(false);
    }
  }

  const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  const brutalBorder = "border-2 border-black !rounded-none"
  const cardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  const cardBorder = "border-4 border-black !rounded-none"

  return (
    <div className="flex min-h-screen items-center justify-center bg-yellow-300 px-4 py-12 sm:px-6 lg:px-8 font-sans text-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-black inline-block px-6 py-2 border-4 border-black">
            WorkLog
          </h1>
          <p className="mt-6 text-xl font-bold bg-white inline-block px-4 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            결과가 아닌 과정을 소통하는 공간.
          </p>
        </div>

        <Card className={`bg-white ${cardBorder} ${cardShadow}`}>
          <CardHeader className="space-y-1 pb-8 border-b-4 border-black bg-emerald-300 text-center">
            <CardTitle className="text-3xl font-black uppercase">Start Journey</CardTitle>
            <CardDescription className="text-black font-bold text-base mt-2">
              가입 절차 없이 구글 계정으로 단 3초 만에 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-12 pb-6">
            {error && (
              <div className="bg-red-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 font-bold text-black flex items-start gap-3 mb-6">
                <span className="text-xl leading-none mt-0.5">⚠️</span> 
                <span className="leading-tight">{error}</span>
              </div>
            )}
            
            <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              className={`w-full bg-white text-black px-8 py-8 font-black text-xl flex items-center justify-center gap-4 ${brutalBorder} hover:bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}
            >
              {isLoading ? (
                <span>연결 중...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                  <span>Google로 시작하기</span>
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t-4 border-black bg-slate-50 p-6 text-center">
            <p className="text-sm font-bold text-slate-600">
              이미 구글로 로그인한 이력이 있다면 클릭 한 번으로 이전 작업들을 모두 불러옵니다.
            </p>
          </CardFooter>
        </Card>
        
        <div className="text-center mt-8 pb-12">
          <Link href="/" className="text-lg font-black bg-white inline-block px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            ← 구경만 할래요 (피드 가기)
          </Link>
        </div>
      </div>
    </div>
  )
}
