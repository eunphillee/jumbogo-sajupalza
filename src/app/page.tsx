'use client';

import { useState } from 'react';
import Image from 'next/image';
import SajuForm from '@/components/SajuForm';
import SajuResult from '@/components/SajuResult';
import { SajuInput, SajuResult as SajuResultType, ChatGPTResponse, ApiResponse } from '@/types';

export default function HomePage() {
  const [sajuResult, setSajuResult] = useState<SajuResultType | null>(null);
  const [chatGPTAnalysis, setChatGPTAnalysis] = useState<ChatGPTResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [chatGPTLoading, setChatGPTLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSajuSubmit = async (formData: SajuInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/saju', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse<SajuResultType> = await response.json();

      if (result.success && result.data) {
        setSajuResult(result.data);
        setChatGPTAnalysis(undefined); // 새로운 사주 결과이므로 ChatGPT 분석 초기화
      } else {
        setError(result.error || '사주 계산 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Saju calculation error:', err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetChatGPTAnalysis = async () => {
    if (!sajuResult) return;

    setChatGPTLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sajuResult }),
      });

      const result: ApiResponse<ChatGPTResponse> = await response.json();

      if (result.success && result.data) {
        setChatGPTAnalysis(result.data);
      } else {
        setError(result.error || 'ChatGPT 분석 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('ChatGPT analysis error:', err);
      setError('ChatGPT 서버 연결 오류가 발생했습니다.');
    } finally {
      setChatGPTLoading(false);
    }
  };

  const handleReset = () => {
    setSajuResult(null);
    setChatGPTAnalysis(undefined);
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          점보고 사주팔자
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          정확한 명리학 기반 사주팔자 분석과 AI ChatGPT의 전문적인 해석을 제공합니다.
          생년월일시와 성별, 이름을 입력하시면 상세한 사주팔자를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 히어로 섹션 */}
      {!sajuResult && (
        <div className="my-16">
          {/* 메인 히어로 섹션 */}
          <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative px-8 py-20 text-center text-white">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <svg className="w-10 h-10 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    점보고와 함께하는<br />
                    <span className="text-yellow-300">운세 여행</span>
                  </h2>
                  <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
                    수천 년 전통의 사주팔자와 최신 AI 기술이 만나<br />
                    당신만의 특별한 운명을 알아보세요
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">AI 맞춤 분석</h3>
                    <p className="text-sm opacity-80">ChatGPT 기반 전문 해석</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">정확한 계산</h3>
                    <p className="text-sm opacity-80">전통 명리학 기반</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold mb-2">완벽한 보안</h3>
                    <p className="text-sm opacity-80">개인정보 안전 보호</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 장식 요소 */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-blue-300/20 rounded-full blur-xl"></div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {!sajuResult ? (
        <SajuForm onSubmit={handleSajuSubmit} loading={loading} />
      ) : (
        <div className="space-y-6">
          <SajuResult
            result={sajuResult}
            chatGPTAnalysis={chatGPTAnalysis}
            onGetChatGPTAnalysis={handleGetChatGPTAnalysis}
            loading={chatGPTLoading}
          />
          
          <div className="text-center">
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              새로운 사주 보기
            </button>
          </div>
        </div>
      )}

      {/* 개선된 특징 섹션 */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">왜 점보고를 선택해야 할까요?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            전통 명리학과 최신 AI 기술이 만나 더욱 정확하고 상세한 사주팔자 분석을 제공합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">정확한 계산</h3>
            <p className="text-gray-600 leading-relaxed">
              수천 년 전통의 명리학 이론에 기반한 정확한 사주팔자 계산으로 
              신뢰할 수 있는 결과를 제공합니다.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">AI 맞춤 분석</h3>
            <p className="text-gray-600 leading-relaxed">
              ChatGPT AI를 활용한 전문적이고 상세한 사주 해석과 
              개인별 맞춤형 인생 조언을 받아보세요.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">완벽한 보안</h3>
            <p className="text-gray-600 leading-relaxed">
              입력하신 개인정보는 사주 계산에만 사용되며 
              최고 수준의 보안으로 안전하게 보호됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 