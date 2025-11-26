import React, { useState } from 'react';
import { VideoAnalysisResponse, TargetAudience } from '../types';
import { Copy, Check, Sparkles, Hash, RefreshCw, RotateCcw, TrendingUp, Search, Globe, Flag, MessageSquareText } from 'lucide-react';

interface ResultsProps {
  data: VideoAnalysisResponse;
  onReset: () => void;
  onRegenerate: () => void;
  onSwitchStrategy: (audience: TargetAudience) => void;
  isRegenerating?: boolean;
  currentAudience: TargetAudience;
}

export const Results: React.FC<ResultsProps> = ({ 
  data, 
  onReset, 
  onRegenerate, 
  onSwitchStrategy,
  isRegenerating,
  currentAudience
}) => {
  const [copiedState, setCopiedState] = useState<{id: string, type: string} | null>(null);

  const handleCopy = (text: string, id: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState({ id, type });
    setTimeout(() => setCopiedState(null), 2000);
  };

  const getTagsString = (tags: string[]) => {
    return tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col gap-6 border-b border-gray-800 pb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            {currentAudience === 'GLOBAL' ? (
              <>
                <Globe className="text-blue-500 w-7 h-7" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">글로벌 타겟</span>
              </>
            ) : (
              <>
                <TrendingUp className="text-red-500 w-7 h-7" />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">조회수 폭발</span>
              </>
            )}
            <span className="text-white">제목 제안</span>
          </h2>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button 
              onClick={onReset}
              disabled={isRegenerating}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors text-gray-300 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              다른 영상
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={onRegenerate}
              disabled={isRegenerating}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg
                ${currentAudience === 'GLOBAL' 
                  ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20' 
                  : 'bg-red-600 hover:bg-red-500 shadow-red-900/20'
                } text-white disabled:opacity-50`}
            >
              <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? '분석 중...' : '맘에 안 들어 (다시 생성)'}
            </button>

            <button
              onClick={() => onSwitchStrategy(currentAudience === 'KOREAN' ? 'GLOBAL' : 'KOREAN')}
              disabled={isRegenerating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl text-sm font-medium transition-all text-gray-200"
            >
              {currentAudience === 'KOREAN' ? (
                <>
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>🌏 글로벌(영어+한국어) 버전으로 보기</span>
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 text-red-400" />
                  <span>🇰🇷 한국 전용 버전으로 보기</span>
                </>
              )}
            </button>
        </div>
      </div>

      <div className="grid gap-8">
        {data.suggestions.map((item, idx) => {
          const cardId = `card-${idx}`;
          return (
            <div 
              key={idx} 
              className={`
                border rounded-xl overflow-hidden transition-all duration-300 group shadow-lg relative
                ${currentAudience === 'GLOBAL' 
                  ? 'bg-gray-800/40 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800/60' 
                  : 'bg-gray-800/40 border-gray-700 hover:border-red-500/50 hover:bg-gray-800/60'
                }
              `}
            >
              {/* Rank Badge */}
              <div className="absolute top-0 left-0 bg-gray-700/50 px-3 py-1 rounded-br-xl text-xs font-mono text-gray-400 border-r border-b border-gray-700">
                OPTION {idx + 1}
              </div>

              <div className="p-6 pt-10 space-y-5">
                {/* Title Section */}
                <div className="flex items-start justify-between gap-4">
                  <h3 className={`text-xl md:text-2xl font-black text-white leading-tight transition-colors tracking-tight ${currentAudience === 'GLOBAL' ? 'group-hover:text-blue-400' : 'group-hover:text-red-400'}`}>
                    {item.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(item.title, cardId, 'title')}
                    className={`
                      flex-shrink-0 p-2.5 rounded-lg transition-all transform active:scale-95 border
                      ${currentAudience === 'GLOBAL'
                        ? 'bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border-blue-500/20 hover:border-blue-500'
                        : 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border-red-500/20 hover:border-red-500'
                      }
                    `}
                    title="제목 복사"
                  >
                    {copiedState?.id === cardId && copiedState?.type === 'title' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Description Section */}
                <div className="bg-black/20 rounded-lg border border-gray-700/50 relative group/desc">
                   <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquareText className="w-3 h-3" />
                        {currentAudience === 'GLOBAL' ? 'SEO Description (Eng/Kor)' : '검색 최적화 설명글'}
                      </p>
                      <button
                        onClick={() => handleCopy(item.description, cardId, 'desc')}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                      >
                        {copiedState?.id === cardId && copiedState?.type === 'desc' ? (
                          <>
                             <Check className="w-3 h-3" /> 복사완료
                          </>
                        ) : (
                          <>
                             <Copy className="w-3 h-3" /> 설명 복사
                          </>
                        )}
                      </button>
                   </div>
                  <p className="p-4 text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
                
                {/* Reasoning Section */}
                <div className={`flex gap-4 p-4 rounded-lg border ${currentAudience === 'GLOBAL' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <Sparkles className={`w-5 h-5 flex-shrink-0 mt-0.5 ${currentAudience === 'GLOBAL' ? 'text-blue-400' : 'text-red-400'}`} />
                  <div>
                    <p className={`text-xs font-bold mb-1 uppercase tracking-wider ${currentAudience === 'GLOBAL' ? 'text-blue-400' : 'text-red-400'}`}>
                      {currentAudience === 'GLOBAL' ? 'Global Viral Point' : '조회수 상승 포인트'}
                    </p>
                    <p className="text-sm text-gray-300">
                      {item.reasoning}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="border-t border-gray-700/50 pt-3">
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        추천 태그
                      </p>
                      <button
                        onClick={() => handleCopy(getTagsString(item.tags), cardId, 'tags')}
                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                      >
                         {copiedState?.id === cardId && copiedState?.type === 'tags' ? (
                          <>
                             <Check className="w-3 h-3" /> 복사완료
                          </>
                        ) : (
                          <>
                             <Copy className="w-3 h-3" /> 전체 복사
                          </>
                        )}
                      </button>
                   </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-xs font-medium px-2.5 py-1 bg-gray-700/30 text-gray-400 rounded-full flex items-center gap-1 hover:text-white transition-colors cursor-default"
                      >
                        <span className="opacity-50">#</span>
                        {tag.replace(/^#/, '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};