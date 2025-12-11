import React from 'react';
import { LTVResult } from '../types';
import { formatCurrency, formatKoreanNumber } from '../utils/formatters';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultsCardProps {
  result: LTVResult;
  colorTheme: 'blue' | 'indigo' | 'rose';
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, colorTheme }) => {
  const { percent, totalLimit, availableAmount } = result;
  
  const themeClasses = {
    blue: "border-blue-200 bg-blue-50/50 text-blue-900",
    indigo: "border-indigo-200 bg-indigo-50/50 text-indigo-900",
    rose: "border-rose-200 bg-rose-50/50 text-rose-900",
  };

  const barColor = {
    blue: "bg-blue-600",
    indigo: "bg-indigo-600",
    rose: "bg-rose-600",
  };

  const Icon = percent === 70 ? CheckCircle2 : percent === 75 ? TrendingUp : AlertCircle;

  return (
    <div className={`rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-md ${themeClasses[colorTheme]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Icon className="w-6 h-6 opacity-80" />
          LTV {percent}%
        </h3>
        <span className="text-sm font-medium opacity-70">최대 한도 비율</span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm opacity-70 mb-1">총 대출 한도</p>
          <p className="text-2xl font-bold tracking-tight">{formatKoreanNumber(totalLimit)}</p>
          <p className="text-xs opacity-60 font-mono mt-1">{formatCurrency(totalLimit)}</p>
        </div>

        <div className="w-full h-px bg-current opacity-20 my-2"></div>

        <div>
          <p className="text-sm font-semibold mb-1 flex items-center justify-between">
            <span>추가 대출 가능 금액</span>
            {availableAmount > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 border border-current">가능</span>}
          </p>
          <p className={`text-3xl font-extrabold tracking-tight ${availableAmount > 0 ? '' : 'opacity-50'}`}>
             {availableAmount > 0 ? formatKoreanNumber(availableAmount) : '0원 (한도초과)'}
          </p>
          {availableAmount > 0 && (
            <p className="text-xs opacity-60 font-mono mt-1">{formatCurrency(availableAmount)}</p>
          )}
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden mt-4 relative">
            <div 
                className={`h-full ${barColor[colorTheme]}`} 
                style={{ width: '100%' }}
            ></div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCard;