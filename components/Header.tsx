import React from 'react';
import { Youtube, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="p-2 bg-red-600 rounded-lg shadow-lg shadow-red-900/50">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">
          Tube<span className="text-red-500">Hook</span> AI
        </h1>
      </div>
      <p className="text-gray-400 max-w-lg mx-auto mt-4 text-lg">
        영상을 업로드하면 AI가 <span className="text-white font-semibold">조회수를 부르는 제목</span>을 자동으로 생성해드립니다.
      </p>
    </header>
  );
};