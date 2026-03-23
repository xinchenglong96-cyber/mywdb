-- 1. 사용자 신고 테이블 (reports)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reported_log_id UUID REFERENCES public.logs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 사용자 차단 테이블 (blocks)
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- 권한 우회 (RLS 해제 상태 유지)
ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks DISABLE ROW LEVEL SECURITY;
