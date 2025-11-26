import React, { useState } from 'react';
import { Header } from './components/Header';
import { FileUploader } from './components/FileUploader';
import { Results } from './components/Results';
import { generateHookTitles } from './services/geminiService';
import { AppState, VideoAnalysisResponse, TargetAudience } from './types';
import { Loader2, AlertCircle, Globe, Flag } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [results, setResults] = useState<VideoAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audience, setAudience] = useState<TargetAudience>('KOREAN');

  const handleAnalyze = async (overrideAudience?: TargetAudience) => {
    if (!file) return;
    
    // Determine the strategy to use (override takes precedence, useful for switching modes in result view)
    const targetAudience = overrideAudience || audience;
    
    // Update state if we are switching modes via override
    if (overrideAudience) {
      setAudience(overrideAudience);
    }

    const isRegenerating = status === AppState.SUCCESS;
    
    setStatus(AppState.ANALYZING);
    setError(null);
    if (!isRegenerating) {
      setResults(null); 
    }
    
    try {
      const data = await generateHookTitles(file, targetAudience);
      setResults(data);
      setStatus(AppState.SUCCESS);
    } catch (e: any) {
      console.error(e);
      let errorMessage = "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      
      if (e.message && e.message.includes("413")) {
        errorMessage = "파일 크기가 너무 큽니다. 짧은 영상(20MB 이하)으로 시도해주세요.";
      } else if (e.message && e.message.includes("API_KEY")) {
        errorMessage = "API 키 설정을 확인해주세요.";
      }
      
      setError(errorMessage);
      setStatus(AppState.ERROR);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResults(null);
    setStatus(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pb-20 selection:bg-red-500/30">
      <div className="max-w-4xl mx-auto space-y-10">
        <Header />

        <div className="space-y-8">
           {/* Upload Section */}
           {status !== AppState.SUCCESS && (
             <div className="space-y-8 animate-fade-in">
               <FileUploader 
                  onFileSelect={setFile} 
                  selectedFile={file} 
                  onClear={handleClear} 
                  disabled={status === AppState.ANALYZING}
               />

               {file && (
                 <div className="flex flex-col items-center gap-6">
                   {/* Audience Selector */}
                   <div className="flex bg-gray-800 p-1.5 rounded-xl border border-gray-700">
                      <button
                        onClick={() => setAudience('KOREAN')}
                        disabled={status === AppState.ANALYZING}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                          audience === 'KOREAN' 
                            ? 'bg-gray-700 text-white shadow-md' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Flag className="w-4 h-4" />
                        <span>🇰🇷 국내 올인</span>
                      </button>
                      <button
                        onClick={() => setAudience('GLOBAL')}
                        disabled={status === AppState.ANALYZING}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all duration-200 ${
                          audience === 'GLOBAL' 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <span>🌏 국내+해외 (글로벌)</span>
                      </button>
                   </div>

                   {/* Main Action Button */}
                   <button
                     onClick={() => handleAnalyze()}
                     disabled={status === AppState.ANALYZING}
                     className={`
                       relative overflow-hidden group w-full max-w-md
                       ${audience === 'GLOBAL' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600'}
                       text-white text-lg font-bold py-4 px-8 rounded-full 
                       shadow-xl ${audience === 'GLOBAL' ? 'shadow-blue-900/40' : 'shadow-red-900/40'}
                       transition-all duration-300 transform hover:scale-105 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                       flex items-center justify-center gap-3
                     `}
                   >
                     {status === AppState.ANALYZING ? (
                       <>
                         <Loader2 className="w-6 h-6 animate-spin" />
                         <span>알고리즘 분석 중...</span>
                       </>
                     ) : (
                       <>
                         {audience === 'GLOBAL' ? (
                           <>
                             <Globe className="w-5 h-5" />
                             <span>글로벌 조회수 사냥하기</span>
                           </>
                         ) : (
                           <>
                             <span className="text-xl">🔥</span>
                             <span>후킹 제목 생성하기</span>
                           </>
                         )}
                       </>
                     )}
                   </button>
                 </div>
               )}
             </div>
           )}

           {/* Error Message */}
           {status === AppState.ERROR && (
             <div className="bg-red-950/40 border border-red-800 text-red-200 p-4 rounded-xl flex items-center gap-3 justify-center animate-fade-in">
               <AlertCircle className="w-5 h-5 flex-shrink-0" />
               <p>{error}</p>
             </div>
           )}

           {/* Results */}
           {status === AppState.SUCCESS && results && (
             <Results 
               data={results} 
               onReset={handleClear} 
               onRegenerate={() => handleAnalyze()} // Same strategy
               onSwitchStrategy={(newAudience) => handleAnalyze(newAudience)} // Switch strategy
               isRegenerating={status === AppState.ANALYZING} 
               currentAudience={audience}
             />
           )}
           
           {/* Loading Overlay */}
           {status === AppState.ANALYZING && results && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
                 <div className="bg-gray-800 p-8 rounded-2xl flex flex-col items-center gap-5 shadow-2xl border border-gray-700">
                    <Loader2 className={`w-12 h-12 animate-spin ${audience === 'GLOBAL' ? 'text-blue-500' : 'text-red-500'}`} />
                    <div className="text-center space-y-2">
                       <p className="text-xl font-bold text-white">
                         {audience === 'GLOBAL' ? '글로벌 트렌드 분석 중...' : '한국인이 좋아하는 드립 장전 중...'}
                       </p>
                       <p className="text-sm text-gray-400">조금만 기다려주세요!</p>
                    </div>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}