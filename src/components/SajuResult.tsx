'use client';

import { SajuResult as SajuResultType, ChatGPTResponse } from '@/types';

interface SajuResultProps {
  result: SajuResultType;
  chatGPTAnalysis?: ChatGPTResponse;
  onGetChatGPTAnalysis: () => void;
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
              <h4 className="font-semibold text-purple-800 mb-2">궁합</h4>
              <p className="text-purple-700 text-sm">{result.compatibility}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT 분석 */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">AI 상세 분석</h3>
          {!chatGPTAnalysis && (
            <button
              onClick={onGetChatGPTAnalysis}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '분석 중...' : 'AI 분석 받기'}
            </button>
          )}
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
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4">ChatGPT를 통해 더 상세한 사주 분석을 받아보세요.</p>
            <p className="text-sm">AI가 제공하는 전문적인 해석과 조언을 확인할 수 있습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
} 