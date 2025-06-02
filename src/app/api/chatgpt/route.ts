import { NextRequest, NextResponse } from 'next/server';
import { SajuResult, ChatGPTResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sajuResult } = body;

    if (!sajuResult) {
      return NextResponse.json({
        success: false,
        error: '사주 결과 데이터가 필요합니다.'
      }, { status: 400 });
    }

    // OpenAI API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    // ChatGPT API 호출을 위한 프롬프트 생성
    const prompt = generateSajuAnalysisPrompt(sajuResult);

    // OpenAI ChatGPT API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        // model: 'gpt-4o-mini', // 더 경제적인 모델 사용 (주석처리)
        model: 'gpt-3.5-turbo', // GPT-3.5 터보 모델 사용
        messages: [
          {
            role: 'system',
            content: `당신은 한국의 전문 사주팔자 명리학자입니다. 
            전통 명리학 지식을 바탕으로 정확하고 상세한 사주 분석을 제공해주세요.
            답변은 반드시 한국어로 작성하고, 존댓말을 사용해주세요.
            결과는 JSON 형식으로 다음 구조를 따라주세요:
            {
              "interpretation": "상세한 사주 해석 (500자 이상)",
              "summary": "핵심 요약 (100자 내외)",
              "recommendations": ["조언1", "조언2", "조언3", "조언4", "조언5"]
            }`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API 에러:', errorData);
      return NextResponse.json({
        success: false,
        error: 'ChatGPT 분석 중 오류가 발생했습니다.'
      }, { status: 500 });
    }

    const chatGPTResponse = await response.json();
    const content = chatGPTResponse.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({
        success: false,
        error: 'ChatGPT 응답을 받을 수 없습니다.'
      }, { status: 500 });
    }

    // JSON 파싱 시도
    let analysisResult: ChatGPTResponse;
    try {
      // ChatGPT가 JSON 형식으로 응답하지 않을 수 있으므로 처리
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        // JSON 형식이 아닌 경우 기본 구조로 변환
        analysisResult = {
          interpretation: content,
          summary: content.substring(0, 100) + '...',
          recommendations: [
            '지속적인 자기계발과 학습을 추천합니다.',
            '인간관계에서 소통을 중요시하세요.',
            '건강 관리에 꾸준히 신경 쓰시기 바랍니다.',
            '목표를 명확히 하고 계획적으로 행동하세요.',
            '긍정적인 마음가짐을 유지하시기 바랍니다.'
          ]
        };
      }
    } catch (parseError) {
      console.error('JSON 파싱 에러:', parseError);
      analysisResult = {
        interpretation: content,
        summary: '전반적으로 균형 잡힌 사주를 가지고 계십니다.',
        recommendations: [
          '꾸준한 노력과 인내로 목표를 달성하세요.',
          '주변 사람들과의 조화로운 관계를 유지하세요.',
          '자신의 장점을 활용한 분야에서 능력을 발휘하세요.',
          '건강한 생활습관을 유지하시기 바랍니다.',
          '새로운 기회에 열린 마음으로 도전하세요.'
        ]
      };
    }

    console.log('ChatGPT 분석 결과:', analysisResult);

    return NextResponse.json({
      success: true,
      data: analysisResult
    });

  } catch (error) {
    console.error('ChatGPT API 에러:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

function generateSajuAnalysisPrompt(sajuResult: SajuResult): string {
  return `다음 사주팔자를 매우 상세하고 전문적으로 분석해주세요:

**기본 정보:**
- 이름: ${sajuResult.name}
- 성별: ${sajuResult.gender === 'male' ? '남성' : '여성'}
- 생년월일: ${sajuResult.birthDate}
- 출생시간: ${sajuResult.birthTime}

**사주팔자:**
- 년주(年柱): ${sajuResult.year_pillar}
- 월주(月柱): ${sajuResult.month_pillar}  
- 일주(日柱): ${sajuResult.day_pillar}
- 시주(時柱): ${sajuResult.hour_pillar}

**기본 분석 결과 (이보다 훨씬 더 상세하게 분석해주세요):**
- 성격: ${sajuResult.personality}
- 운세: ${sajuResult.fortune}
- 직업운: ${sajuResult.career}
- 연애운: ${sajuResult.love}
- 건강운: ${sajuResult.health}
- 금전운: ${sajuResult.financial_fortune}

**상세 분석 요청사항:**
1. **오행 분석**: 각 기둥의 오행(목화토금수) 분포와 균형, 상생상극 관계 상세 설명
2. **십신 분석**: 일간을 중심으로 한 십신(정관, 편관, 정재, 편재, 식신, 상관, 비견, 겁재, 정인, 편인) 배치와 그 의미
3. **대운과 세운**: 현재 나이대의 대운과 올해 세운이 사주에 미치는 영향
4. **성격 심층 분석**: 일주를 중심으로 한 성격의 장단점, 내재된 재능과 약점
5. **직업 적성**: 사주 구조에 따른 최적의 직업군과 피해야 할 직업
6. **재물운 상세**: 재성의 배치와 강약, 재물 획득 방법과 시기
7. **건강운 상세**: 오행 불균형으로 인한 건강 취약점과 관리법
8. **인간관계**: 배우자궁, 자녀궁 분석과 인간관계 패턴
9. **연도별 운세**: 향후 3-5년간의 세부 운세 변화
10. **개운 방법**: 부족한 오행을 보완하는 구체적인 방법 (색깔, 방향, 직업, 생활습관 등)

전통 명리학 이론에 근거하여 매우 상세하고 실용적인 분석을 제공해주세요.
특히 일주 ${sajuResult.day_pillar}의 특성을 중심으로 깊이 있는 해석을 부탁드립니다.
기본 분석보다 3-4배 더 자세하고 전문적인 내용으로 작성해주세요.`;
} 