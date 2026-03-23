"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignupPage() {
  const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  const brutalBorder = "border-2 border-black !rounded-none"
  const cardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  const cardBorder = "border-4 border-black !rounded-none"

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-300 px-4 py-12 sm:px-6 lg:px-8 font-sans text-black">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-black inline-block px-6 py-2 border-4 border-black">
            Join WorkLog
          </h1>
        </div>

        <Card className={`bg-white ${cardBorder} ${cardShadow}`}>
          <CardHeader className="space-y-1 pb-6 border-b-4 border-black bg-blue-300">
            <CardTitle className="text-3xl font-black uppercase">Sign Up</CardTitle>
            <CardDescription className="text-black font-bold text-base mt-2">
              새 계정을 만들고 당당하게 작업 과정을 공유해보세요!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 bg-white">
            <div className="space-y-3">
              <label htmlFor="name" className="text-lg font-black uppercase block">Nickname</label>
              <Input 
                id="name" 
                type="text" 
                placeholder="사용할 멋진 닉네임" 
                className={`bg-white px-3 py-6 text-lg font-bold placeholder:text-neutral-400 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all`} 
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="email" className="text-lg font-black uppercase block">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@university.ac.kr" 
                className={`bg-white px-3 py-6 text-lg font-bold placeholder:text-neutral-400 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all`} 
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="password" className="text-lg font-black uppercase block">Password</label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className={`bg-white px-3 py-6 text-lg font-bold placeholder:text-neutral-400 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all`} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t-4 border-black bg-slate-50 p-6">
            <Button className={`w-full bg-black text-white px-8 py-6 font-bold text-xl ${brutalBorder} hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
              회원가입 완료
            </Button>
            <div className="mt-4 text-center">
              <span className="text-black font-bold">이미 계정이 있으신가요? </span>
              <Link href="/login" className="text-blue-700 font-black hover:bg-black hover:text-white px-1 border-2 border-transparent hover:border-black transition-colors">
                로그인하기
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
