import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely. 
// Note: In a real production app, API calls should be routed through a backend to hide the key.
// For this client-side demo environment, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey });

export const getFinancialAdvice = async (
  propertyValue: number, 
  existingLoan: number
): Promise<string> => {
  if (!apiKey) {
    return "API Key가 설정되지 않았습니다. 환경 변수를 확인해주세요.";
  }

  try {
    const prompt = `
      나는 현재 아파트 담보 대출 계산기를 사용하고 있습니다.
      
      내 상황:
      - 아파트 시세: ${propertyValue.toLocaleString()}원
      - 기존 대출금: ${existingLoan.toLocaleString()}원
      
      요청사항:
      1. LTV 70%, 75%, 80% 구간별로 추가 대출이 가능한지, 그리고 이로 인한 리스크가 어느 정도인지 간단히 분석해주세요.
      2. 금리 인상기나 하락기에 따른 일반적인 조언을 한 문단으로 덧붙여주세요.
      3. 전문적인 금융 용어보다는 이해하기 쉬운 한국어로 답변해주세요.
      4. 마크다운 형식으로 출력해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on simple queries
      }
    });

    return response.text || "분석 결과를 가져올 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 금융 분석 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};