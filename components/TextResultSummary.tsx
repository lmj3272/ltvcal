import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { LTVResult, OccupancyType } from '../types';
import { formatKoreanNumber } from '../utils/formatters';

interface TextResultSummaryProps {
  results: LTVResult[];
  propertyValue: number;
  existingLoan: number;
  deduction: number;
  occupancyType: OccupancyType;
}

const TextResultSummary: React.FC<TextResultSummaryProps> = ({
  results,
  propertyValue,
  existingLoan,
  deduction,
  occupancyType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    const deductionLabel = occupancyType === 'owner' ? '방공제(소액임차보증금)' : '세입자 보증금';
    
    let generatedText = `[Smart LTV 계산기 결과 리포트]\n\n`;
    generatedText += `■ 기본 정보\n`;
    generatedText += `- 아파트 시세: ${propertyValue.toLocaleString()}원\n`;
    generatedText += `- 점유 형태: ${occupancyType === 'owner' ? '실거주' : '세입자 거주'}\n`;
    generatedText += `- ${deductionLabel}: ${deduction.toLocaleString()}원\n`;
    generatedText += `- 기존 대출금: ${existingLoan.toLocaleString()}원\n\n`;
    
    generatedText += `■ LTV 구간별 한도 결과\n`;
    generatedText += `(※ 아래 총 한도는 ${occupancyType === 'owner' ? '방공제' : '보증금'} 차감 후 금액입니다)\n\n`;

    results.forEach((res) => {
      generatedText += `${res.percent}% 구간 (LTV ${res.percent}%)\n`;
      generatedText += `- 총 대출 한도: ${formatKoreanNumber(res.totalLimit)} (${res.totalLimit.toLocaleString()}원)\n`;
      generatedText += `- 추가 가능 금액: ${formatKoreanNumber(res.availableAmount)} (${res.availableAmount.toLocaleString()}원)\n\n`;
    });

    generatedText += `--------------------------------\n`;
    generatedText += `* 본 결과는 참고용이며, 실제 대출 가능 여부는 금융사의 심사에 따라 달라질 수 있습니다.`;

    setText(generatedText);
  }, [results, propertyValue, existingLoan, deduction, occupancyType]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">전체 결과값 출력</h3>
            <p className="text-slate-500 text-sm">클릭하여 텍스트로 된 상세 리포트를 확인하고 복사하세요.</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="relative">
            <textarea
              readOnly
              value={text}
              className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition-all
                  ${copied 
                    ? 'bg-green-500 text-white border-green-500' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    복사하기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextResultSummary;