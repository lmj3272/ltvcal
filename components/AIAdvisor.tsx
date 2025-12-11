import React, { useState } from 'react';
import { getFinancialAdvice } from '../services/geminiService';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  propertyValue: number;
  existingLoan: number;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ propertyValue, existingLoan }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const handleGetAdvice = async () => {
    if (propertyValue === 0) return;
    
    setLoading(true);
    setAdvice('');
    
    try {
      const result = await getFinancialAdvice(propertyValue, existingLoan);
      setAdvice(result);
      setHasFetched(true);
    } catch (e) {
      setAdvice("분석 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">AI 금융 파트너</h3>
            <p className="text-slate-400 text-sm">Gemini가 분석하는 내 대출 리포트</p>
          </div>
        </div>
        
        {!hasFetched && (
          <button
            onClick={handleGetAdvice}
            disabled={loading || propertyValue === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
              ${propertyValue === 0 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/30'
              }`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            {loading ? '분석중...' : 'AI 분석 요청하기'}
          </button>
        )}
      </div>

      {hasFetched && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{advice}</ReactMarkdown>
          </div>
          <div className="mt-4 flex justify-end">
             <button
                onClick={handleGetAdvice}
                disabled={loading}
                className="text-xs text-slate-400 hover:text-white transition-colors underline"
             >
                다시 분석하기
             </button>
          </div>
        </div>
      )}
      
      {!hasFetched && !loading && (
        <div className="text-center py-8 text-slate-500 text-sm">
          버튼을 눌러 현재 시세와 대출금에 대한 맞춤형 리스크 분석을 받아보세요.
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;