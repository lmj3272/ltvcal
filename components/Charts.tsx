import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CalculationData } from '../types';
import { formatKoreanNumber } from '../utils/formatters';

interface ChartsProps {
  data: CalculationData;
}

const Charts: React.FC<ChartsProps> = ({ data }) => {
  const { propertyValue, existingLoan, depositDeduction, occupancyType } = data;

  if (propertyValue === 0) return null;

  const deductionLabel = occupancyType === 'owner' ? '소액임차보증금' : '세입자보증금';

  const chartData = [
    {
      name: 'LTV 70%',
      limit: propertyValue * 0.7,
      existing: existingLoan,
      deduction: depositDeduction,
      available: Math.max(0, (propertyValue * 0.7) - existingLoan - depositDeduction),
    },
    {
      name: 'LTV 75%',
      limit: propertyValue * 0.75,
      existing: existingLoan,
      deduction: depositDeduction,
      available: Math.max(0, (propertyValue * 0.75) - existingLoan - depositDeduction),
    },
    {
      name: 'LTV 80%',
      limit: propertyValue * 0.8,
      existing: existingLoan,
      deduction: depositDeduction,
      available: Math.max(0, (propertyValue * 0.8) - existingLoan - depositDeduction),
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const existing = payload.find((p: any) => p.dataKey === 'existing')?.value || 0;
      const deduction = payload.find((p: any) => p.dataKey === 'deduction')?.value || 0;
      const available = payload.find((p: any) => p.dataKey === 'available')?.value || 0;
      const totalUsed = existing + deduction;

      return (
        <div className="bg-white p-4 border border-slate-200 shadow-lg rounded-lg text-sm">
          <p className="font-bold mb-2 text-slate-800">{label}</p>
          <div className="space-y-1">
             <p className="text-slate-500">기존 대출: <span className="font-medium text-slate-900">{formatKoreanNumber(existing)}</span></p>
             {deduction > 0 && (
                <p className="text-amber-600">{deductionLabel}: <span className="font-medium">{formatKoreanNumber(deduction)}</span></p>
             )}
             <p className="text-indigo-600">추가 가능: <span className="font-bold">{formatKoreanNumber(available)}</span></p>
             <div className="border-t pt-1 mt-1">
               <p className="text-slate-700">총 한도: {formatKoreanNumber(totalUsed + available)}</p>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold mb-6 text-slate-800">LTV 구간별 한도 비교</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend wrapperStyle={{paddingTop: '20px'}} />
            <ReferenceLine y={propertyValue} label="시세(100%)" stroke="red" strokeDasharray="3 3" opacity={0.3} />
            <Bar dataKey="existing" name="기존 대출" stackId="a" fill="#94a3b8" />
            <Bar dataKey="deduction" name={deductionLabel} stackId="a" fill="#d97706" />
            <Bar dataKey="available" name="추가 가능" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;