'use client';

import { SajuResult as SajuResultType, ChatGPTResponse } from '@/types';

interface SajuResultProps {
  result: SajuResultType;
  chatGPTAnalysis?: ChatGPTResponse | null;
  onGetChatGPTAnalysis: (sajuResult: SajuResultType) => Promise<ChatGPTResponse>;
  loading?: boolean;
}

export default function SajuResult({ 
  result, 
  chatGPTAnalysis, 
  onGetChatGPTAnalysis, 
  loading = false 
}: SajuResultProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          사주팔자 결과
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-600">기본 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">이름:</span>
                <span className="font-medium">{result.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">성별:</span>
                <span className="font-medium">{result.gender === 'male' ? '남성' : '여성'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">생년월일:</span>
                <span className="font-medium">{formatDate(result.birthDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">출생시간:</span>
                <span className="font-medium">{result.birthTime}</span>
              </div>
              {result.birthLocation && (
                <div className="flex justify-between">
                  <span className="text-gray-600">출생지:</span>
                  <span className="font-medium">{result.birthLocation}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-600">사주팔자</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">년주</div>
                <div className="font-bold text-blue-800">{result.year_pillar}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">월주</div>
                <div className="font-bold text-green-800">{result.month_pillar}</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-600 mb-1">일주</div>
                <div className="font-bold text-yellow-800">{result.day_pillar}</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">시주</div>
                <div className="font-bold text-purple-800">{result.hour_pillar}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기본 분석 */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">기본 사주 분석</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-pink-50 rounded-lg">
              <h4 className="font-semibold text-pink-800 mb-2">성격</h4>
              <p className="text-pink-700 text-sm">{result.personality}</p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">직업운</h4>
              <p className="text-orange-700 text-sm">{result.career}</p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">연애운</h4>
              <p className="text-red-700 text-sm">{result.love}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">건강운</h4>
              <p className="text-green-700 text-sm">{result.health}</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">운세</h4>
              <p className="text-blue-700 text-sm">{result.fortune}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">금전운</h4>
              <p className="text-purple-700 text-sm">{result.financial_fortune}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT 분석 */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">AI 상세 분석</h3>
        </div>

        {chatGPTAnalysis ? (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-3">종합 해석</h4>
              <p className="text-indigo-700 leading-relaxed whitespace-pre-wrap">
                {chatGPTAnalysis.interpretation}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">요약</h4>
              <p className="text-gray-700">{chatGPTAnalysis.summary}</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-3">인생 조언</h4>
              <ul className="space-y-2">
                {chatGPTAnalysis.recommendations.map((advice, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-green-200 text-green-800 text-sm font-bold rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-green-700 flex-1">{advice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI 분석을 진행 중입니다...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">AI 전문가 분석</h4>
              <p className="text-gray-600 mb-6">ChatGPT가 사주팔자를 상세히 분석해드립니다.</p>
              <button
                onClick={() => onGetChatGPTAnalysis(result)}
                className="btn-primary py-3 px-8 text-lg font-semibold"
                disabled={loading}
              >
                AI 분석 받기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 