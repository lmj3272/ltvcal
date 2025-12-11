export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatKoreanNumber = (num: number): string => {
  if (num === 0) return '0원';
  let result = '';
  const eok = Math.floor(num / 100000000);
  const remainder = num % 100000000;
  const man = Math.floor(remainder / 10000);

  if (eok > 0) result += `${eok}억 `;
  if (man > 0) result += `${man.toLocaleString()}만`;
  
  return result.trim() + '원';
};

export const parseRawInput = (value: string): number => {
  return Number(value.replace(/[^0-9]/g, ''));
};