import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Plus, Home, Users } from 'lucide-react';
import InputSection from './components/InputSection';
import ResultsCard from './components/ResultsCard';
import Charts from './components/Charts';
import TextResultSummary from './components/TextResultSummary';
import { LTVResult, OccupancyType } from './types';
import { formatKoreanNumber } from './utils/formatters';

interface LoanItem {
  id: number;
  value: number;
}

const App: React.FC = () => {
  const [occupancy, setOccupancy] = useState<OccupancyType>('owner');
  const [propertyValue, setPropertyValue] = useState<number>(0);
  const [loans, setLoans] = useState<LoanItem[]>([{ id: 1, value: 0 }]);
  
  // Independent states for each deposit type
  const [smallTenantDeposit, setSmallTenantDeposit] = useState<number>(0);
  const [tenantDeposit, setTenantDeposit] = useState<number>(0);

  // Effect to reset/clear values when switching occupancy types
  useEffect(() => {
    if (occupancy === 'owner') {
      setTenantDeposit(0);
    } else {
      setSmallTenantDeposit(0);
    }
  }, [occupancy]);

  // Calculate the total of all loans
  const totalExistingLoan = useMemo(() => {
    return loans.reduce((sum, loan) => sum + loan.value, 0);
  }, [loans]);

  // Determine the active deduction amount based on occupancy
  const activeDeduction = occupancy === 'owner' ? smallTenantDeposit : tenantDeposit;

  const addLoan = () => {
    setLoans(prev => [...prev, { id: Date.now(), value: 0 }]);
  };

  const updateLoan = (id: number, newValue: number) => {
    setLoans(prev => prev.map(loan => loan.id === id ? { ...loan, value: newValue } : loan));
  };

  const removeLoan = (id: number) => {
    if (loans.length > 1) {
      setLoans(prev => prev.filter(loan => loan.id !== id));
    }
  };

  const calculateLTV = (percent: number): LTVResult => {
    // 1. Calculate Raw LTV Limit (e.g., 70% of Property Value)
    const rawLtvLimit = Math.floor(propertyValue * (percent / 100));
    
    // 2. Calculate Effective Limit by subtracting the active deduction (Bang-gong-je or Tenant Deposit)
    // The user requested that the "Total Loan Limit" output should be the limit AFTER deduction.
    const effectiveLimit = Math.max(0, rawLtvLimit - activeDeduction);
    
    // 3. Calculate Available Amount: Effective Limit - Existing Loans
    const availableAmount = Math.max(0, effectiveLimit - totalExistingLoan);
    
    return {
      percent,
      totalLimit: effectiveLimit, // This now reflects (LTV% - Deduction)
      availableAmount
    };
  };

  const results = useMemo(() => {
    return [
      calculateLTV(70),
      calculateLTV(75),
      calculateLTV(80)
    ];
  }, [propertyValue, totalExistingLoan, activeDeduction]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg mb-2">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart LTV 계산기
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            보유하신 아파트의 시세와 대출금, 임차보증금을 입력하시면 LTV 구간별 한도를 즉시 계산해드립니다.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs & Chart */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b">정보 입력</h2>
              <div className="space-y-6">
                
                {/* Occupancy Type Selection */}
                <div className="flex gap-4 p-1 bg-slate-100 rounded-lg">
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md cursor-pointer transition-all font-semibold text-sm
                    ${occupancy === 'owner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <input 
                      type="radio" 
                      name="occupancy" 
                      className="hidden" 
                      checked={occupancy === 'owner'}
                      onChange={() => setOccupancy('owner')}
                    />
                    <Home className="w-4 h-4" />
                    실거주
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md cursor-pointer transition-all font-semibold text-sm
                    ${occupancy === 'tenant' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    <input 
                      type="radio" 
                      name="occupancy" 
                      className="hidden" 
                      checked={occupancy === 'tenant'}
                      onChange={() => setOccupancy('tenant')}
                    />
                    <Users className="w-4 h-4" />
                    세입자 거주
                  </label>
                </div>

                <InputSection 
                  label="아파트 현재 시세 (KB시세 등)" 
                  value={propertyValue} 
                  onChange={setPropertyValue}
                  icon="property"
                />
                
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">기존 대출 정보</h3>
                  {loans.map((loan, index) => (
                    <InputSection 
                      key={loan.id}
                      label={`대출 원금 ${index + 1}`} 
                      value={loan.value} 
                      onChange={(val) => updateLoan(loan.id, val)}
                      icon="loan"
                      onDelete={loans.length > 1 ? () => removeLoan(loan.id) : undefined}
                    />
                  ))}
                  
                  <button 
                    onClick={addLoan}
                    className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm font-semibold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    대출 추가하기
                  </button>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-100">
                   <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">차감 금액</h3>
                   
                   {/* Conditionally rendered/enabled inputs */}
                   <InputSection 
                    label="소액임차보증금액 (방공제)" 
                    value={smallTenantDeposit} 
                    onChange={setSmallTenantDeposit}
                    icon="deduction"
                    disabled={occupancy === 'tenant'}
                  />
                   <InputSection 
                    label="세입자 보증금" 
                    value={tenantDeposit} 
                    onChange={setTenantDeposit}
                    icon="tenant"
                    disabled={occupancy === 'owner'}
                  />
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col gap-2 border border-slate-200">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">총 기존 대출</span>
                        <span className="font-semibold text-slate-700">{formatKoreanNumber(totalExistingLoan)}</span>
                    </div>
                    {activeDeduction > 0 && (
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">
                                {occupancy === 'owner' ? '방공제 금액' : '세입자 보증금'}
                            </span>
                            <span className="font-semibold text-amber-600">-{formatKoreanNumber(activeDeduction)}</span>
                        </div>
                    )}
                    <div className="h-px bg-slate-200 my-1"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-bold">총 차감액</span>
                        <span className="text-lg font-bold text-slate-900">{(totalExistingLoan + activeDeduction).toLocaleString()}원</span>
                    </div>
                </div>

              </div>
            </div>

            <Charts 
              data={{ 
                propertyValue, 
                existingLoan: totalExistingLoan, 
                depositDeduction: activeDeduction,
                occupancyType: occupancy
              }} 
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid gap-4">
               <ResultsCard result={results[0]} colorTheme="blue" />
               <ResultsCard result={results[1]} colorTheme="indigo" />
               <ResultsCard result={results[2]} colorTheme="rose" />
            </div>

            {/* Total Results Text Output */}
            <TextResultSummary 
              results={results}
              propertyValue={propertyValue}
              existingLoan={totalExistingLoan}
              deduction={activeDeduction}
              occupancyType={occupancy}
            />
          </div>

        </div>

        <footer className="text-center pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            * 본 계산 결과는 참고용이며, 실제 대출 가능 여부와 한도는 개인의 신용도 및 금융사의 정책에 따라 달라질 수 있습니다.<br/>
            * DSR(총부채원리금상환비율) 규제 적용 여부에 따라 실제 한도는 줄어들 수 있습니다.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;