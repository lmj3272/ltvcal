import React from 'react';
import { formatKoreanNumber, parseRawInput } from '../utils/formatters';
import { Building2, Landmark, Trash2, Shield, Users } from 'lucide-react';

interface InputSectionProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  icon: 'property' | 'loan' | 'deduction' | 'tenant';
  onDelete?: () => void;
  disabled?: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ label, value, onChange, icon, onDelete, disabled = false }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseRawInput(e.target.value);
    onChange(isNaN(newVal) ? 0 : newVal);
  };

  const getIcon = () => {
    switch (icon) {
      case 'property': return <Building2 className="w-4 h-4" />;
      case 'loan': return <Landmark className="w-4 h-4" />;
      case 'deduction': return <Shield className="w-4 h-4" />;
      case 'tenant': return <Users className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex flex-col gap-2 transition-opacity duration-300 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
          {getIcon()}
          {label}
        </label>
        {onDelete && !disabled && (
          <button 
            onClick={onDelete}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
            aria-label="대출 삭제"
            title="이 대출 삭제"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          value={value === 0 ? '' : value.toLocaleString()}
          onChange={handleChange}
          disabled={disabled}
          placeholder={disabled ? "입력 불가" : "0"}
          className={`w-full px-4 py-3 text-lg font-bold border rounded-lg outline-none transition-all pr-12 
            ${disabled 
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800'
            }`}
        />
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 font-medium ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>원</span>
      </div>
      <div className="h-6 text-right">
        <span className={`text-sm font-medium ${disabled ? 'text-slate-400' : 'text-indigo-600'}`}>
            {formatKoreanNumber(value)}
        </span>
      </div>
    </div>
  );
};

export default InputSection;