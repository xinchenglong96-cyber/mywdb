"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  const brutalBorder = "border-2 border-black !rounded-none"
  const cardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  const cardBorder = "border-4 border-black !rounded-none"

  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-200 px-4 py-12 sm:px-6 lg:px-8 font-sans text-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-black inline-block px-6 py-2 border-4 border-black">
            Reset Password
          </h1>
        </div>

        <Card className={`bg-white ${cardBorder} ${cardShadow}`}>
          <CardHeader className="space-y-1 pb-6 border-b-4 border-black bg-orange-300">
            <CardTitle className="text-3xl font-black uppercase">비밀번호 찾기</CardTitle>
            <CardDescription className="text-black font-bold text-base mt-2">
              가입하신 이메일을 입력하시면 복구 링크를 보내드립니다.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {submitted ? (
                <div className="bg-green-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 font-bold text-black flex items-start gap-3">
                  <span className="text-xl leading-none mt-0.5">📩</span> 
                  <span className="leading-tight">입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다! 보관함을 확인해주세요.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <label htmlFor="email" className="text-lg font-black uppercase block">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@university.ac.kr" 
                    required
                    className={`bg-white px-3 py-6 text-lg font-bold placeholder:text-neutral-400 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all`} 
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t-4 border-black bg-slate-50 p-6">
              {!submitted && (
                <Button type="submit" className={`w-full bg-black text-white px-8 py-6 font-bold text-xl ${brutalBorder} hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
                  복구 메일 전송
                </Button>
              )}
              <div className="mt-4 text-center">
                <Link href="/login" className="text-blue-700 font-bold hover:bg-black hover:text-white px-2 py-1 border-2 border-transparent hover:border-black transition-all">
                  ← 로그인 화면으로 돌아가기
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
