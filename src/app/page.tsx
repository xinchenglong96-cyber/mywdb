"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Home, Compass, Bell, User, PenSquare, Image as ImageIcon, Video, Trash2, Pencil, X, Loader2, CalendarIcon, TrashIcon, PencilIcon, XIcon, MessageSquareIcon, LogOutIcon, MoreVerticalIcon, CompassIcon } from "lucide-react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

type FeedbackItem = {
  id: string;
  type: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: { nickname: string };
}

type LogItem = {
  id: string;
  project_id: string;
  user_id: string;
  content: string;
  media_type?: string;
  media_url?: string;
  likes: number;
  bg_color: string;
  created_at: string;
  users?: { nickname: string };
  projects?: { title: string };
  feedbacks: FeedbackItem[];
};

const isVideoUrl = (url: string) => {
  if (!url) return false;
  return !!url.match(/\.(mp4|webm|ogg|mov)$/i);
};

const MediaCarousel = ({ urls }: { urls: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<{x: number, y: number, time: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  const minSwipeDistance = 50;
  const maxSwipeTime = 350; // ms

  const nextSlide = () => setCurrentIndex(prev => (prev === urls.length - 1 ? prev : prev + 1));
  const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? 0 : prev - 1));

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(null);
    if ('targetTouches' in e) {
      setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY, time: Date.now() });
    } else {
      setTouchStart({ x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY, time: Date.now() });
    }
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return;
    if ('targetTouches' in e) {
      setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    } else {
      setTouchEnd({ x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY });
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const timeElapsed = Date.now() - touchStart.time;
    
    // 빠른 시간(350ms 미만) 내에 이루어지고, 수평 이동이 수직 이동보다 크며, 최소 거리를 충족해야 스와이프로 인정 (네이티브 플레이어의 느린 조작, 탭, 세로 스크롤 무시)
    if (timeElapsed < maxSwipeTime && Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (urls.length <= 1) {
    const isVideo = isVideoUrl(urls[0]);
    return (
      <div className="w-full max-h-[600px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden flex items-center justify-center relative mt-4">
        {isVideo ? (
          <video src={urls[0]} controls playsInline preload="metadata" className="max-w-full max-h-[600px] w-auto h-auto object-contain mx-auto select-none" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={urls[0]} alt="media-0" className="max-w-full max-h-[600px] w-auto h-auto object-contain mx-auto select-none" draggable={false} />
        )}
      </div>
    );
  }

  return (
    <div 
      className="w-full h-auto border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden relative mt-4 group cursor-grab active:cursor-grabbing block"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
    >
      <div 
        className="flex transition-transform duration-300 ease-in-out w-full h-full items-center"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {urls.map((url, i) => {
          const isVideo = isVideoUrl(url);
          return (
            <div key={`img-${i}`} className="w-full min-w-full max-w-full max-h-[600px] flex-none flex items-center justify-center bg-black overflow-hidden relative">
              {isVideo ? (
                <video 
                  src={url} 
                  controls 
                  playsInline 
                  preload="metadata" 
                  className="max-w-full max-h-[600px] w-auto h-auto object-contain mx-auto select-none" 
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={url} alt={`media-${i}`} className="max-w-full max-h-[600px] w-auto h-auto object-contain mx-auto select-none pointer-events-none" draggable={false} />
              )}
            </div>
          );
        })}
      </div>

      <div 
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 p-4 -m-4 cursor-pointer select-none ${currentIndex === 0 ? 'hidden' : ''}`}
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="bg-white p-3 sm:p-4 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-200 transition-colors active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-black text-xl pointer-events-none"
        >
          {"<"}
        </button>
      </div>
      <div 
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 p-4 -m-4 cursor-pointer select-none ${currentIndex === urls.length - 1 ? 'hidden' : ''}`}
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <button 
          type="button"
          className="bg-white p-3 sm:p-4 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-200 transition-colors active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-black text-xl pointer-events-none"
        >
          {">"}
        </button>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/50 px-3 py-2 rounded-full border-2 border-black backdrop-blur-sm z-10 pointer-events-none">
        {urls.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${i === currentIndex ? 'bg-yellow-400' : 'bg-white'}`} />
        ))}
      </div>
    </div>
  );
};

export default function FeedPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<any>(null); // { nickname, avatar_url, email }

  const [newProject, setNewProject] = useState("")
  const [newContent, setNewContent] = useState("")

  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const [filterUserName, setFilterUserName] = useState<string | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string | null>(null);
  const [filterProjectName, setFilterProjectName] = useState<string | null>(null);

  const [activeFeedbackLogId, setActiveFeedbackLogId] = useState<string | null>(null);
  const [activeFeedbackType, setActiveFeedbackType] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");

  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<{logId: string, feedbackId: string} | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // 다중 미디어 업로드 상태
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 수정 (Edit) 상태
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editLogContent, setEditLogContent] = useState("");
  const [editExistingUrls, setEditExistingUrls] = useState<string[]>([]);
  const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
  const [editNewFiles, setEditNewFiles] = useState<File[]>([]);

  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);
  const [editFeedbackContent, setEditFeedbackContent] = useState("");

  useEffect(() => {
    const fetchUserProfile = async (uid: string, sessionMeta: any, sessionEmail: string) => {
      const { data } = await supabase.from('users').select('*').eq('id', uid).single();
      if (data) {
        setSessionUser({
          nickname: data.nickname,
          avatar_url: sessionMeta?.avatar_url || null
        });
      } else {
        // SQL 트리거가 없거나 실패해서 DB 테이블에 이 유저가 없을 경우 자가 치유(Self-Healing)
        const fallbackNickname = sessionMeta?.full_name || sessionMeta?.name || '구글 접속자';
        setSessionUser({
          nickname: fallbackNickname,
          avatar_url: sessionMeta?.avatar_url || null
        });
        
        // 프론트엔드 코드가 권한을 갖고 직접 DB에 인서트 해버림!
        await supabase.from('users').upsert({
          id: uid,
          nickname: fallbackNickname,
          email: sessionEmail
        });
      }
    };

    const initAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const urlError = searchParams.get('error_description') || hashParams.get('error_description');
      
      if (urlError) {
        let msg = decodeURIComponent(urlError.replace(/\+/g, ' '));
        if (msg.includes('sending') || msg.includes('email')) {
          msg = "현재 Supabase 기본 이메일 서버 전송 한도가 초과되었거나 오류가 발생했습니다.\n\n[해결 방법]\nSupabase 대시보드 👉 Authentication 👉 Providers 👉 Email 메뉴에서\n'Confirm email' 과 'Send welcome email' 옵션을 OFF(끄기)로 설정하고 저장한 뒤 구글 로그인을 다시 시도해주세요!";
        }
        setAlertMessage(`⚠️ 구글 연동 중 오류 발생\n\n${msg}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setMyUserId(session.user.id);
        fetchUserProfile(session.user.id, session.user.user_metadata, session.user.email || '');
      } else {
        setMyUserId(null);
        setSessionUser(null);
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          setMyUserId(session.user.id);
          fetchUserProfile(session.user.id, session.user.user_metadata, session.user.email || '');
        } else {
          setMyUserId(null);
          setSessionUser(null);
        }
      });
    };

    initAuth();
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    let query = supabase
      .from('logs')
      .select(`
        *,
        users ( nickname ),
        projects ( title ),
        feedbacks (
          id, type, content, created_at, user_id,
          users ( nickname )
        )
      `)
      .order('created_at', { ascending: false });

    if (filterUserId) query = query.eq('user_id', filterUserId);
    if (filterProjectId) query = query.eq('project_id', filterProjectId);

    const { data: logsData, error } = await query;

    if (error) {
      console.error("logs 불러오기 에러:", error);
    } else if (logsData) {
      setLogs(logsData as any);
    }
    setIsLoading(false);
  }, [filterUserId, filterProjectId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      setAlertMessage("업로드 부담을 줄이기 위해 한 번에 최대 5장까지만 올릴 수 있습니다.");
      return;
    }
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setSelectedFiles(prev => [...prev, ...files]);
    setFilePreviews(prev => [...prev, ...newPreviewUrls]);
  };

  const handleCancelFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setFilePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!myUserId) {
      setAlertMessage("글을 작성하려면 먼저 구글 로그인을 진행해주세요!");
      return;
    }
    if (!newProject.trim() || !newContent.trim()) {
      setAlertMessage("프로젝트 이름과 작업 내용을 모두 입력해주세요!");
      return;
    }

    setIsUploading(true);
    let uploadedUrls: string[] = [];

    // 멀티 미디어 파일이 선택된 경우 Supabase Storage 연동
    if (selectedFiles.length > 0) {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);
        
        if (uploadError) {
          setIsUploading(false);
          console.error("Upload Error:", uploadError);
          setAlertMessage(`파일 첨부 실패!\n에러 메시지: ${uploadError.message}`);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    // 프로젝트 확인 및 생성
    let projectId = null;
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('title', newProject)
      .eq('user_id', myUserId)
      .single();

    if (existingProject) {
      projectId = existingProject.id;
    } else {
      const { data: createdProject, error } = await supabase
        .from('projects')
        .insert({ title: newProject, user_id: myUserId })
        .select().single();
      if (error) console.error("프로젝트 생성 에러:", error);
      if (createdProject) projectId = createdProject.id;
    }

    if (!projectId) {
      setIsUploading(false);
      return;
    }

    // 작업 로그 (Post) 생성
    const { data: newLog, error } = await supabase
      .from('logs')
      .insert({
        project_id: projectId,
        user_id: myUserId,
        content: newContent,
        media_url: uploadedUrls.length > 0 ? JSON.stringify(uploadedUrls) : null,
        bg_color: ['bg-green-300', 'bg-blue-300', 'bg-yellow-300', 'bg-pink-300'][Math.floor(Math.random() * 4)]
      })
      .select(`
        *,
        users ( nickname ),
        projects ( title ),
        feedbacks ( * )
      `)
      .single();

    setIsUploading(false);

    if (error) {
      console.error("로그 생성 에러:", error);
      setAlertMessage("업로드 중 오류가 발생했습니다.");
    } else if (newLog) {
      newLog.feedbacks = newLog.feedbacks || [];
      setLogs([newLog as any, ...logs]);
      setNewProject('');
      setNewContent('');
      clearAllFiles();
    }
  }

  // 삭제 & 수정 (로그)
  const confirmDeleteLog = (logId: string) => setLogToDelete(logId);
  const executeDeleteLog = async () => {
    if (!logToDelete) return;
    const { error } = await supabase.from('logs').delete().eq('id', logToDelete).eq('user_id', myUserId);
    if (!error) {
      setLogs(logs.filter(log => log.id !== logToDelete));
    } else {
      setAlertMessage("로그 삭제 중 오류가 발생했습니다.");
    }
    setLogToDelete(null);
  };

  const startEditLog = (logId: string, currentContent: string, mediaUrl: string | null | undefined) => {
    setEditingLogId(logId);
    setEditLogContent(currentContent);
    if (mediaUrl) {
      try {
        const parsed = JSON.parse(mediaUrl);
        setEditExistingUrls(Array.isArray(parsed) ? parsed : [parsed]);
      } catch {
        setEditExistingUrls([mediaUrl]);
      }
    } else {
      setEditExistingUrls([]);
    }
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    setEditLogContent("");
    setEditExistingUrls([]);
    setEditNewFiles([]);
    setEditNewPreviews([]);
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (editExistingUrls.length + editNewFiles.length + files.length > 5) {
      setAlertMessage("미디어는 최대 5장까지만 유지/추가할 수 있습니다.");
      return;
    }
    const newFs = [...editNewFiles, ...files];
    const newPreviewUrls = files.map(f => URL.createObjectURL(f));
    setEditNewFiles(newFs);
    setEditNewPreviews(prev => [...prev, ...newPreviewUrls]);
  };

  const handleCancelEditNewFile = (index: number) => {
    const newFs = editNewFiles.filter((_, i) => i !== index);
    setEditNewFiles(newFs);
    setEditNewPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleRemoveExistingUrl = (index: number) => {
    setEditExistingUrls(prev => prev.filter((_, i) => i !== index));
  };

  const saveEditLog = async (logId: string) => {
    if (!editLogContent.trim()) return;
    setIsUploading(true);

    let uploadedUrls: string[] = [];
    if (editNewFiles.length > 0) {
      for (const file of editNewFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
        if (uploadError) {
          setIsUploading(false);
          setAlertMessage(`파일 첨부 실패!\n에러 메시지: ${uploadError.message}`);
          return;
        }
        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    const finalUrls = [...editExistingUrls, ...uploadedUrls];

    const { error } = await supabase.from('logs').update({ 
      content: editLogContent,
      media_url: finalUrls.length > 0 ? JSON.stringify(finalUrls) : null,
    }).eq('id', logId).eq('user_id', myUserId);
    
    setIsUploading(false);

    if (!error) {
      setLogs(logs.map(log => log.id === logId ? { 
        ...log, 
        content: editLogContent,
        media_url: finalUrls.length > 0 ? JSON.stringify(finalUrls) : undefined,
        media_type: 'image'
      } : log));
      handleCancelEdit();
    } else {
      setAlertMessage("로그 수정 중 오류가 발생했습니다.");
    }
  };

  // 삭제 & 수정 (피드백)
  const confirmDeleteFeedback = (logId: string, feedbackId: string) => setFeedbackToDelete({logId, feedbackId});
  const executeDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    const { error } = await supabase.from('feedbacks').delete().eq('id', feedbackToDelete.feedbackId).eq('user_id', myUserId);
    if (!error) {
      setLogs(logs.map(log => {
        if (log.id === feedbackToDelete.logId) {
          return { ...log, feedbacks: log.feedbacks.filter(fb => fb.id !== feedbackToDelete.feedbackId) };
        }
        return log;
      }));
    } else {
      setAlertMessage("피드백 삭제 중 오류가 발생했습니다.");
    }
    setFeedbackToDelete(null);
  };

  const startEditFeedback = (feedbackId: string, currentContent: string) => {
    setEditingFeedbackId(feedbackId);
    setEditFeedbackContent(currentContent);
  };
  const cancelEditFeedback = () => {
    setEditingFeedbackId(null);
    setEditFeedbackContent("");
  };
  const saveEditFeedback = async (logId: string, feedbackId: string) => {
    if (!editFeedbackContent.trim()) return;
    const { error } = await supabase.from('feedbacks').update({ content: editFeedbackContent }).eq('id', feedbackId).eq('user_id', myUserId);
    if (!error) {
      setLogs(logs.map(log => {
        if (log.id === logId) {
          return {
            ...log,
            feedbacks: log.feedbacks.map(fb => fb.id === feedbackId ? { ...fb, content: editFeedbackContent } : fb)
          };
        }
        return log;
      }));
      setEditingFeedbackId(null);
    } else {
      setAlertMessage("피드백 수정 중 오류가 발생했습니다.");
    }
  };

  const handleFeedbackClick = (logId: string, type: string) => {
    if (activeFeedbackLogId === logId && activeFeedbackType === type) {
      setActiveFeedbackLogId(null);
      setActiveFeedbackType("");
      return;
    }
    setActiveFeedbackLogId(logId);
    setActiveFeedbackType(type);
    setFeedbackText("");
  }

  const handleFeedbackSubmit = async (e: React.FormEvent, logId: string) => {
    e.preventDefault();
    if (!myUserId) {
      setAlertMessage("피드백을 남기시려면 로그인이 필요합니다.");
      return;
    }
    if (!feedbackText.trim()) return;

    const { data: newFeedback, error } = await supabase
      .from('feedbacks')
      .insert({ log_id: logId, user_id: myUserId, type: activeFeedbackType, content: feedbackText })
      .select(`*, users ( nickname )`)
      .single();

    if (error) {
      setAlertMessage("피드백 등록 중 오류가 발생했습니다.");
    } else if (newFeedback) {
      setLogs(logs.map(log => 
        log.id === logId 
          ? { ...log, feedbacks: [...(log.feedbacks || []), newFeedback as any] } 
          : log
      ));
      setActiveFeedbackLogId(null);
      setActiveFeedbackType("");
      setFeedbackText("");
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
    return dateStr.slice(0, 10);
  }

  // Custom brutalist classes
  const brutalShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
  const brutalActive = "active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
  const brutalBorder = "border-2 border-black !rounded-none"
  const cardShadow = "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  const cardBorder = "border-4 border-black !rounded-none"

  return (
    <div className="flex min-h-screen bg-pink-50 font-sans text-black relative" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 0)', backgroundSize: '30px 30px' }}>
      {/* Sidebar Navigation */}
      <aside className={`fixed hidden w-64 flex-col bg-green-200 px-4 py-8 sm:flex h-full ${cardBorder} border-y-0 border-l-0 border-r-4 z-10`}>
        <div className="mb-8 px-4">
          <h1 className="text-3xl font-black uppercase tracking-tighter shadow-black drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">WorkLog</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-4 mt-8">
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-yellow-300 ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Home className="h-6 w-6 stroke-[3px]" /> 피드
          </Button>
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-white ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Compass className="h-6 w-6 stroke-[3px]" /> 탐색
          </Button>
          <Button variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-white ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
            <Bell className="h-6 w-6 stroke-[3px]" /> 알림
          </Button>
          {!myUserId && (
            <Button asChild variant="outline" className={`justify-start gap-3 px-4 font-bold text-lg bg-cyan-300 hover:bg-cyan-400 ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
              <Link href="/login">
                <User className="h-6 w-6 stroke-[3px]" /> 로그인하기
              </Link>
            </Button>
          )}
        </nav>
        
        {/* User Profile Block */}
        <div className="mt-auto pt-4 border-t-4 border-black border-dashed">
          {sessionUser ? (
            <>
              <div className="flex items-center gap-3 px-2 py-4 mb-4">
                <Avatar className={`h-12 w-12 ${brutalBorder}`}>
                  {sessionUser.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sessionUser.avatar_url} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-orange-400 font-bold text-black border-2 border-black">
                      {sessionUser.nickname ? sessionUser.nickname.slice(0, 1) : '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-sm font-black uppercase truncate">{sessionUser.nickname}</span>
                  <button onClick={() => supabase.auth.signOut()} className="text-xs font-bold text-slate-800 text-left hover:text-blue-600 underline decoration-2 mt-1">로그아웃</button>
                </div>
              </div>
              <Button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className={`w-full gap-2 font-black text-lg py-6 bg-red-400 text-black hover:bg-red-500 hover:text-black ${brutalBorder} ${brutalShadow} ${brutalActive}`} size="lg">
                <PenSquare className="h-6 w-6 stroke-[3]" /> 새 작업 기록
              </Button>
            </>
          ) : (
            <div className="py-2">
              <p className="text-base font-bold text-black mb-4">가입하고 나만의 로그를 기록하세요!</p>
              <Button asChild className={`w-full gap-2 font-black text-lg py-6 bg-white text-black hover:bg-slate-100 ${brutalBorder} ${brutalShadow} ${brutalActive}`} size="lg">
                <Link href="/login">🚀 구글로 시작하기</Link>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 sm:ml-64 bg-transparent min-h-screen">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <header className="mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] bg-black inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              FEED
            </h2>
            <p className="text-md font-bold text-black mt-4 ml-6 bg-yellow-300 inline-block px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              치열한 고민의 흔적을 첨부자료와 함께 소통하세요.
            </p>
          </header>

          {/* Filter Banner */}
          {(filterUserId || filterProjectId) && (
            <div className={`mb-12 bg-blue-300 p-4 font-black flex flex-col sm:flex-row justify-between items-center gap-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
              <div className="text-xl break-all">
                {filterUserId ? `👤 ${filterUserName} 님의 피드 모아보기` : `📁 프로젝트 [${filterProjectName}] 모아보기`}
              </div>
              <Button 
                onClick={() => { setFilterUserId(null); setFilterProjectId(null); }} 
                className={`w-full sm:w-auto bg-white text-black hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}
              >
                전체 보기로 돌아가기
              </Button>
            </div>
          )}

          {/* Create Log Input Form */}
          {!(filterUserId || filterProjectId) && (
            <Card className={`mb-12 ${cardBorder} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white`}>
              <form onSubmit={handleSubmit}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className={`mt-1 h-12 w-12 ${brutalBorder} ${!myUserId ? 'opacity-50' : ''}`}>
                  {sessionUser?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sessionUser.avatar_url} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-cyan-300 font-bold text-black border-2 border-black">
                      {sessionUser?.nickname ? sessionUser.nickname.slice(0, 1) : '?'}
                    </AvatarFallback>
                  )}
                  </Avatar>
                  <div className="flex-1 space-y-4">
                    <Input 
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      placeholder={myUserId ? "어떤 프로젝트를 작업 중이신가요?" : "🔥 참여하려면 먼저 로그인해주세요!"} 
                      className={`bg-white px-3 py-6 text-lg font-bold placeholder:text-neutral-500 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all disabled:opacity-50`} 
                      disabled={isUploading || !myUserId}
                    />
                    <Textarea 
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder={myUserId ? "오늘 수정한 부분, 막힌 에러, 새로운 시도를 공유하세요! 사진이나 영상 업로드도 실지원합니다." : "로그인 후 나만의 멋진 작업 과정을 남겨보세요."} 
                      className={`min-h-[120px] bg-white px-3 py-4 font-bold placeholder:text-neutral-500 resize-none ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] transition-all disabled:opacity-50`}
                      disabled={isUploading || !myUserId}
                    />

                    {/* Multi-Media Preview Box */}
                    {filePreviews.length > 0 && (
                      <div className={`relative w-full p-4 bg-slate-100 ${brutalBorder} ${brutalShadow}`}>
                        <p className="text-sm font-black mb-3 text-slate-800">첨부된 미디어 미리보기 ({filePreviews.length}/5)</p>
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                          {filePreviews.map((preview, i) => {
                            const isVideo = selectedFiles[i]?.type.startsWith('video/');
                            return (
                            <div key={i} className={`relative flex-shrink-0 w-32 h-auto max-h-32 ${brutalBorder} snap-center`}>
                              <Button type="button" onClick={() => handleCancelFile(i)} variant="outline" size="icon" className={`absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-black h-8 w-8 rounded-full border-2 border-black z-10 p-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`} disabled={isUploading}>
                                <X className="h-5 w-5 stroke-[3]" />
                              </Button>
                              {isVideo ? (
                                <video src={preview} className="w-full h-auto object-contain bg-black max-h-32" />
                              ) : (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={preview} alt={'pre-'+i} className="w-full h-auto object-contain bg-black" />
                              )}
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              {/* Hidden File Inputs */}
              <input type="file" id="image-upload" accept="image/*,video/*" multiple className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={handleFileSelect} />

              <CardFooter className="justify-between border-t-4 border-black bg-cyan-200 px-6 py-4">
                <div className="flex gap-4 text-black font-bold">
                  <Button type="button" onClick={() => myUserId && document.getElementById('image-upload')?.click()} variant="outline" className={`bg-white gap-2 font-black ${brutalBorder} ${brutalShadow} ${brutalActive}`} disabled={isUploading || !myUserId}>
                    <ImageIcon className="h-5 w-5 stroke-[2]" /> 사진/영상 첨부 (+5)
                  </Button>
                </div>
                {!myUserId ? (
                  <Button asChild type="button" className={`bg-black text-white px-8 font-bold text-lg min-w-[120px] ${brutalBorder} hover:bg-slate-800 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
                    <Link href="/login">구글 로그인</Link>
                  </Button>
                ) : (
                  <Button type="submit" className={`bg-black text-white px-8 font-bold text-lg flex items-center justify-center min-w-[120px] ${brutalBorder} hover:bg-slate-800 hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`} disabled={isUploading}>
                    {isUploading ? <Loader2 className="animate-spin h-6 w-6 stroke-[3]" /> : '업로드'}
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
          )}

          {/* Feed Logs */}
          <div className="space-y-12 mb-20">
            {logs.length === 0 && !isLoading && (
              <div className="text-center bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-2xl font-black">아직 등록된 작업 로그가 없습니다.</p>
                <p className="text-lg font-bold mt-2">상단의 폼을 통해 첫 로그를 남겨보세요!</p>
              </div>
            )}
            {logs.map(log => (
              <Card key={log.id} className={`${log.bg_color || 'bg-white'} ${cardBorder} ${cardShadow}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-start gap-4 w-full">
                      <Avatar className={`h-14 w-14 mt-1 ${brutalBorder}`}>
                        <AvatarFallback className="bg-white font-black text-3xl text-black border-2 border-black">
                          {log.users?.nickname ? log.users.nickname.slice(0, 1) : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2 flex-wrap w-full">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFilterProjectId(log.project_id); setFilterProjectName(log.projects?.title || 'Unknown'); setFilterUserId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                            className="bg-white hover:bg-yellow-200 transition-all inline-block px-3 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none text-2xl sm:text-3xl font-black uppercase max-w-fit leading-tight break-all border-b-[6px] text-left"
                            title="이 프로젝트의 모든 피드 모아보기"
                          >
                            {log.projects?.title || 'Unknown'} 
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-base font-bold text-slate-800 bg-white/50 w-fit px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-1">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFilterUserId(log.user_id); setFilterUserName(log.users?.nickname || 'Unknown'); setFilterProjectId(null); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                            className="underline decoration-2 underline-offset-2 break-all hover:text-blue-600 transition-colors text-left flex items-center gap-1 active:text-blue-800"
                            title="이 작성자의 모든 피드 모아보기"
                          >
                            <span className="text-xl">👤</span> {log.users?.nickname || 'Unknown'} <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full border border-black no-underline">모아보기</span>
                          </button>
                          <span className="font-extrabold text-slate-400">•</span>
                          <span className="text-sm font-black">{timeAgo(log.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {myUserId && log.user_id === myUserId && (
                      <div className="flex gap-2">
                        <Button onClick={() => startEditLog(log.id, log.content, log.media_url)} variant="outline" size="icon" className={`bg-blue-300 hover:bg-blue-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`}>
                          <Pencil className="h-5 w-5 stroke-[2]" />
                        </Button>
                        <Button onClick={() => confirmDeleteLog(log.id)} variant="outline" size="icon" className={`bg-red-400 hover:bg-red-500 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all`}>
                          <Trash2 className="h-5 w-5 stroke-[3]" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`bg-white p-4 ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4`}>
                    
                    {/* Log Content or Editor */}
                    {editingLogId === log.id ? (
                      <div className="flex flex-col gap-3">
                        <Textarea 
                          value={editLogContent} 
                          onChange={(e) => setEditLogContent(e.target.value)} 
                          className={`min-h-[100px] bg-yellow-50 font-bold resize-none ${brutalBorder} focus-visible:ring-0 shadow-inner p-3`}
                        />
                        
                        {/* 편집 모드: 기존 및 새 첨부파일 관리 */}
                        <div className={`w-full p-4 bg-slate-100 ${brutalBorder}`}>
                          <p className="text-sm font-black mb-3 text-slate-800">미디어 편집 (최대 5장)</p>
                          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                            {/* 기존 미디어 */}
                            {editExistingUrls.map((url, i) => {
                              const isVideo = isVideoUrl(url);
                              return (
                              <div key={`ex-${i}`} className={`relative flex-shrink-0 w-24 h-auto max-h-24 ${brutalBorder} snap-center`}>
                                <Button type="button" onClick={() => handleRemoveExistingUrl(i)} variant="outline" size="icon" className={`absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-black h-6 w-6 rounded-full border-2 border-black z-10 p-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all`} disabled={isUploading}>
                                  <X className="h-4 w-4 stroke-[3]" />
                                </Button>
                                {isVideo ? (
                                  <video src={url} className="w-full h-auto object-contain bg-black max-h-24" />
                                ) : (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={url} alt={'ex-'+i} className="w-full h-auto object-contain bg-black" />
                                )}
                              </div>
                            )})}
                            {/* 새 미디어 추가본 */}
                            {editNewPreviews.map((preview, i) => {
                              const isVideo = editNewFiles[i]?.type.startsWith('video/');
                              return (
                              <div key={`new-${i}`} className={`relative flex-shrink-0 w-24 h-auto max-h-24 border-2 border-dashed border-blue-500 snap-center bg-white`}>
                                <Button type="button" onClick={() => handleCancelEditNewFile(i)} variant="outline" size="icon" className={`absolute -top-3 -right-3 bg-red-400 hover:bg-red-500 text-black h-6 w-6 rounded-full border-2 border-black z-10 p-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all`} disabled={isUploading}>
                                  <X className="h-4 w-4 stroke-[3]" />
                                </Button>
                                {isVideo ? (
                                  <video src={preview} className="w-full h-auto object-contain bg-black opacity-80 max-h-24" />
                                ) : (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={preview} alt={'pre-'+i} className="w-full h-auto object-contain bg-black opacity-80" />
                                )}
                              </div>
                              );
                            })}
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            <input type="file" id={`edit-image-${log.id}`} accept="image/*,video/*" multiple className="hidden" onClick={(e) => { (e.target as HTMLInputElement).value = ''; }} onChange={handleEditFileSelect} />
                            <Button type="button" onClick={() => document.getElementById(`edit-image-${log.id}`)?.click()} variant="outline" size="sm" className={`bg-white font-black text-xs ${brutalBorder} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`} disabled={isUploading}>+ 사진/영상 추가</Button>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <Button onClick={handleCancelEdit} variant="outline" className={`bg-white font-black ${brutalBorder} ${brutalShadow} active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`}>취소</Button>
                          <Button onClick={() => saveEditLog(log.id)} className={`bg-blue-500 text-white font-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:bg-blue-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all`} disabled={isUploading}>
                            {isUploading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null} 저장
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="whitespace-pre-wrap text-base font-bold leading-relaxed text-black">{log.content}</p>
                        {/* Carousel Render */}
                        {(() => {
                          if (!log.media_url) return null;
                          let urls: string[] = [];
                          try {
                            if (log.media_url.startsWith('[')) urls = JSON.parse(log.media_url);
                            else urls = [log.media_url];
                          } catch {
                            urls = [log.media_url];
                          }
                          if (urls.length === 0) return null;
                          const isVideo = log.media_type === 'video';
                          
                          return <MediaCarousel urls={urls} />;
                        })()}
                      </>
                    )}
                  </div>
                </CardContent>

                {/* Feedback Selection Footer */}
                <CardFooter className="border-t-4 border-black pt-4 pb-4 bg-white/70 backdrop-blur-sm mt-4 flex-col gap-3 items-start">
                  <div className="w-full flex items-center gap-2 mb-2">
                    <span className="font-black bg-black text-white px-2 py-1 text-sm shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">선택형 피드백</span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 border border-black">총 {log.feedbacks?.length || 0}개의 피드백</span>
                  </div>
                  <div className="flex flex-wrap gap-4 w-full">
                    <Button onClick={() => handleFeedbackClick(log.id, '💡 아이디어 제안')} variant="outline" className={`flex-1 gap-2 border-2 border-black !rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-base ${activeFeedbackLogId === log.id && activeFeedbackType === '💡 아이디어 제안' ? 'bg-blue-400 text-white' : 'bg-blue-200 text-black hover:bg-blue-300'} py-6`}>
                      💡 아이디어 제안
                    </Button>
                    <Button onClick={() => handleFeedbackClick(log.id, '🛠️ 해결책 조언')} variant="outline" className={`flex-1 gap-2 border-2 border-black !rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-base ${activeFeedbackLogId === log.id && activeFeedbackType === '🛠️ 해결책 조 조언' ? 'bg-red-500 text-white' : 'bg-red-300 text-black hover:bg-red-400'} py-6`}>
                      🛠️ 해결책 조언
                    </Button>
                    <Button onClick={() => handleFeedbackClick(log.id, '🔥 킵고잉 응원')} variant="outline" className={`flex-1 gap-2 border-2 border-black !rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black text-base ${activeFeedbackLogId === log.id && activeFeedbackType === '🔥 킵고잉 응원' ? 'bg-green-500 text-white' : 'bg-green-300 text-black hover:bg-green-400'} py-6`}>
                      🔥 킵고잉 응원
                    </Button>
                  </div>
                </CardFooter>

                {/* Feedback Input Section (Conditional) */}
                {activeFeedbackLogId === log.id && (
                  <div className="bg-slate-200 border-t-4 border-black p-4">
                    <form onSubmit={(e) => handleFeedbackSubmit(e, log.id)} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center gap-2 w-full">
                        <span className="font-black bg-white border-2 border-black px-3 py-2 flex items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                          {activeFeedbackType}
                        </span>
                        <Input 
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder={myUserId ? "구체적인 피드백이나 응원의 메시지를 남겨주세요." : "로그인 후 소통할 수 있습니다!"}
                          className={`bg-white border-2 border-black font-bold flex-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[4px] focus-visible:translate-y-[4px] focus-visible:shadow-none transition-all py-6 disabled:opacity-50`}
                          disabled={!myUserId}
                          autoFocus
                        />
                        {!myUserId ? (
                          <Button asChild type="button" className={`h-auto bg-black text-white px-6 py-4 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-lg`}>
                            <Link href="/login">가입하기</Link>
                          </Button>
                        ) : (
                          <Button type="submit" className={`h-auto bg-black text-white px-8 py-4 font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all text-lg`}>
                            게시
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* Feedbacks Display */}
                {log.feedbacks && log.feedbacks.length > 0 && (
                  <div className="bg-slate-100 border-t-4 border-black p-4 space-y-4">
                    {log.feedbacks.map(fb => (
                      <div key={fb.id} className="flex gap-3 items-start">
                        <span className="text-xl font-black bg-white px-2 py-2 border-2 border-black inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-1 whitespace-nowrap leading-none">
                          {fb.type.split(' ')[0]} {/* The emoji */}
                        </span>
                        <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 relative">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-black text-black">{fb.users?.nickname || 'Unknown'} <span className="text-xs ml-2 bg-black text-white px-1 leading-none">{fb.type}</span></p>
                          </div>
                          
                          {myUserId && fb.user_id === myUserId && (
                            <div className="absolute top-2 right-2 flex gap-1 bg-white border border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              <button onClick={() => startEditFeedback(fb.id, fb.content)} className="text-blue-500 hover:text-blue-700 transition-colors p-1" title="수정">
                                <Pencil className="h-4 w-4 stroke-[3]" />
                              </button>
                              <button onClick={() => confirmDeleteFeedback(log.id, fb.id)} className="text-red-500 hover:text-red-700 transition-colors p-1" title="삭제">
                                <Trash2 className="h-4 w-4 stroke-[3]" />
                              </button>
                            </div>
                          )}

                          {/* Feedback Content or Editor */}
                          {editingFeedbackId === fb.id ? (
                            <div className="mt-2 flex flex-col gap-2">
                              <Textarea 
                                value={editFeedbackContent} 
                                onChange={(e) => setEditFeedbackContent(e.target.value)} 
                                className={`min-h-[80px] bg-yellow-50 font-bold resize-none ${brutalBorder} focus-visible:ring-0 p-2 text-sm`}
                              />
                              <div className="flex justify-end gap-2">
                                <Button onClick={cancelEditFeedback} variant="outline" size="sm" className={`bg-white font-black text-xs ${brutalBorder} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>취소</Button>
                                <Button onClick={() => saveEditFeedback(log.id, fb.id)} size="sm" className={`bg-black text-white font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>완료</Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-base font-bold text-slate-800 pr-[4rem]">{fb.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </Card>
            ))}
          </div>

        </div>
      </main>

      {/* Delete Log Modal Overlay */}
      {logToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`bg-white p-8 max-w-sm w-full flex flex-col items-center text-center ${cardBorder} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200`}>
            <div className="bg-red-400 p-4 rounded-full border-4 border-black mb-6">
              <Trash2 className="h-10 w-10 stroke-[3] text-black" />
            </div>
            <h3 className="text-2xl font-black mb-2 uppercase text-black">정말 삭제할까요?</h3>
            <p className="font-bold text-slate-700 mb-8 leading-tight">이 작업 기록은 영구적으로 지워지며,<br/>다시는 복구할 수 없습니다.</p>
            <div className="flex gap-4 w-full">
              <Button onClick={() => setLogToDelete(null)} variant="outline" className={`flex-1 py-6 bg-slate-200 font-black text-lg text-black ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
                돌아가기
              </Button>
              <Button onClick={executeDeleteLog} className={`flex-1 py-6 bg-red-500 hover:bg-red-600 text-white font-black text-lg ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Feedback Modal Overlay */}
      {feedbackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`bg-yellow-300 p-8 max-w-sm w-full flex flex-col items-center text-center ${cardBorder} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200`}>
            <h3 className="text-2xl font-black mb-2 uppercase text-black">피드백 삭제</h3>
            <p className="font-bold text-slate-800 mb-8 leading-tight">작성하신 피드백을 영구 삭제하시겠습니까?</p>
            <div className="flex gap-4 w-full">
              <Button onClick={() => setFeedbackToDelete(null)} variant="outline" className={`flex-1 py-6 bg-white font-black text-lg text-black ${brutalBorder} ${brutalShadow} ${brutalActive}`}>
                취소
              </Button>
              <Button onClick={executeDeleteFeedback} className={`flex-1 py-6 bg-black hover:bg-slate-800 text-white font-black text-lg ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal Overlay */}
      {alertMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className={`bg-red-400 p-8 max-w-sm w-full flex flex-col items-center text-center ${cardBorder} shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200`}>
            <h3 className="text-3xl font-black mb-4 uppercase text-black">알림</h3>
            <p className="font-bold text-black mb-8 leading-relaxed whitespace-pre-wrap">{alertMessage}</p>
            <Button onClick={() => setAlertMessage(null)} className={`w-full py-6 bg-black hover:bg-slate-800 text-white font-black text-xl ${brutalBorder} shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all`}>
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
