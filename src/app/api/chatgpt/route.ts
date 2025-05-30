import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { SajuResult, ChatGPTResponse, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: { sajuResult: SajuResult } = await request.json();
    
    if (!body.sajuResult) {
      return NextResponse.json({
        success: false,
        error: '사주 결과 데이터가 필요합니다.',
      } as ApiResponse<null>, { status: 400 });
    }

    const { sajuResult } = body;

    // OpenAI API 키 확인
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      // 데모 모드 - 미리 정의된 응답 반환
      const demoResponse: ChatGPTResponse = {
        interpretation: `${sajuResult.name}님의 사주팔자를 분석해드리겠습니다.

년주 ${sajuResult.year_pillar}, 월주 ${sajuResult.month_pillar}, 일주 ${sajuResult.day_pillar}, 시주 ${sajuResult.hour_pillar}로 구성된 사주를 보면, 전반적으로 균형잡힌 기운을 가지고 계십니다.

특히 ${sajuResult.personality}라는 성격적 특징이 두드러지며, 이는 인생에서 큰 자산이 될 것입니다. ${sajuResult.career}와 관련된 분야에서 특별한 재능을 발휘할 수 있을 것으로 보입니다.

연애 및 결혼 운세를 보면 ${sajuResult.love} 건강 면에서는 ${sajuResult.health} 전체적인 운세로는 ${sajuResult.fortune}

이는 데모 모드로 생성된 기본 해석입니다. 실제 서비스에서는 ChatGPT API를 통해 더욱 정확하고 상세한 분석을 제공받을 수 있습니다.`,
        
        summary: `${sajuResult.name}님은 균형잡힌 사주를 가지고 있으며, 특히 ${sajuResult.personality.substring(0, 20)}... 등의 특징이 두드러집니다.`,
        
        recommendations: [
          '자신의 강점을 살려 꾸준히 노력하시면 좋은 결과를 얻을 수 있습니다.',
          '인간관계에서 진실성과 신뢰를 바탕으로 소통하세요.',
          '건강 관리를 소홀히 하지 마시고 규칙적인 생활을 유지하세요.'
        ]
      };

      return NextResponse.json({
        success: true,
        data: demoResponse,
        message: 'ChatGPT 해석이 완료되었습니다. (데모 모드)',
      } as ApiResponse<ChatGPTResponse>);
    }

    // ChatGPT에게 전달할 프롬프트 생성
    const prompt = `
다음은 한 사람의 사주팔자 정보입니다. 전문적이고 상세한 사주 해석을 해주세요.

**기본 정보:**
- 이름: ${sajuResult.name}
- 성별: ${sajuResult.gender === 'male' ? '남성' : '여성'}
- 생년월일: ${sajuResult.birthDate}
- 생시: ${sajuResult.birthTime}

**사주팔자:**
- 년주: ${sajuResult.year_pillar}
- 월주: ${sajuResult.month_pillar}
- 일주: ${sajuResult.day_pillar}
- 시주: ${sajuResult.hour_pillar}

**기본 분석:**
- 성격: ${sajuResult.personality}
- 직업운: ${sajuResult.career}
- 연애운: ${sajuResult.love}
- 건강운: ${sajuResult.health}
- 운세: ${sajuResult.fortune}
- 궁합: ${sajuResult.compatibility}

위 정보를 바탕으로 다음과 같이 답변해 주세요:
1. 종합적인 사주 해석 (500자 이상)
2. 간단한 요약 (100자 내외)
3. 인생 조언 3가지

한국어로 정중하고 전문적인 어조로 답변해 주세요.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "당신은 경험이 풍부한 명리학 전문가입니다. 사주팔자를 정확하고 상세하게 해석하며, 상담자에게 도움이 되는 조언을 제공합니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json({
        success: false,
        error: 'ChatGPT 응답을 받을 수 없습니다.',
      } as ApiResponse<null>, { status: 500 });
    }

    // 응답을 파싱하여 구조화
    const sections = response.split('\n\n');
    let interpretation = '';
    let summary = '';
    let recommendations: string[] = [];

    // 응답 파싱 (간단한 방식)
    sections.forEach((section, index) => {
      if (index === 0 || section.includes('해석') || section.includes('분석')) {
        interpretation += section + '\n\n';
      } else if (section.includes('요약') || section.includes('정리')) {
        summary = section.replace(/요약|정리/g, '').trim();
      } else if (section.includes('조언') || section.includes('추천')) {
        const lines = section.split('\n').filter(line => line.trim().length > 0);
        recommendations = lines.slice(1).map(line => line.replace(/^\d+\.\s*/, '').trim());
      }
    });

    // 기본값 설정
    if (!interpretation) interpretation = response;
    if (!summary) summary = response.substring(0, 100) + '...';
    if (recommendations.length === 0) {
      recommendations = [
        '자신의 강점을 살려 꾸준히 노력하세요.',
        '인간관계에서 진실성을 유지하세요.',
        '건강 관리에 항상 신경쓰세요.'
      ];
    }

    const chatGPTResponse: ChatGPTResponse = {
      interpretation: interpretation.trim(),
      summary: summary.trim(),
      recommendations: recommendations.slice(0, 3), // 최대 3개
    };

    return NextResponse.json({
      success: true,
      data: chatGPTResponse,
      message: 'ChatGPT 해석이 완료되었습니다.',
    } as ApiResponse<ChatGPTResponse>);

  } catch (error) {
    console.error('ChatGPT API error:', error);
    return NextResponse.json({
      success: false,
      error: 'ChatGPT API 호출 중 오류가 발생했습니다.',
    } as ApiResponse<null>, { status: 500 });
  }
} 