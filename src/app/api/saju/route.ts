import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SajuInput, SajuResult } from '@/types';

// Supabase 클라이언트 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 천간
const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 지지
const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 12시진
const timeSlots = [
  { name: '자시', start: '23:00', end: '01:00', index: 0 },
  { name: '축시', start: '01:00', end: '03:00', index: 1 },
  { name: '인시', start: '03:00', end: '05:00', index: 2 },
  { name: '묘시', start: '05:00', end: '07:00', index: 3 },
  { name: '진시', start: '07:00', end: '09:00', index: 4 },
  { name: '사시', start: '09:00', end: '11:00', index: 5 },
  { name: '오시', start: '11:00', end: '13:00', index: 6 },
  { name: '미시', start: '13:00', end: '15:00', index: 7 },
  { name: '신시', start: '15:00', end: '17:00', index: 8 },
  { name: '유시', start: '17:00', end: '19:00', index: 9 },
  { name: '술시', start: '19:00', end: '21:00', index: 10 },
  { name: '해시', start: '21:00', end: '23:00', index: 11 }
];

// 월령 지지
const monthBranches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];

function calculateSaju(
  name: string,
  gender: string,
  year: number,
  month: number,
  day: number,
  timeString: string
) {
  // 연주 계산 (기준년도 1984년을 갑자년으로 설정)
  const yearOffset = (year - 1984) % 60;
  const yearStemIndex = Math.abs(yearOffset % 10);
  const yearBranchIndex = Math.abs(yearOffset % 12);
  const yearPillar = heavenlyStems[yearStemIndex] + earthlyBranches[yearBranchIndex];

  // 월주 계산
  const monthBranchIndex = monthBranches[month - 1];
  const monthStemIndex = Math.abs((yearStemIndex * 2 + month) % 10);
  const monthPillar = heavenlyStems[monthStemIndex] + earthlyBranches[monthBranchIndex];

  // 일주 계산
  const baseDate = new Date(1984, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = Math.abs(daysDiff % 60);
  const dayStemIndex = Math.abs(dayOffset % 10);
  const dayBranchIndex = Math.abs(dayOffset % 12);
  const dayPillar = heavenlyStems[dayStemIndex] + earthlyBranches[dayBranchIndex];

  // 시주 계산
  let timeBranchIndex = 0;
  let timeSlotName = '자시';
  
  if (timeString) {
    const hour = parseInt(timeString.split(':')[0], 10);
    
    if (hour >= 23 || hour < 1) {
      timeBranchIndex = 0; timeSlotName = '자시';
    } else if (hour >= 1 && hour < 3) {
      timeBranchIndex = 1; timeSlotName = '축시';
    } else if (hour >= 3 && hour < 5) {
      timeBranchIndex = 2; timeSlotName = '인시';
    } else if (hour >= 5 && hour < 7) {
      timeBranchIndex = 3; timeSlotName = '묘시';
    } else if (hour >= 7 && hour < 9) {
      timeBranchIndex = 4; timeSlotName = '진시';
    } else if (hour >= 9 && hour < 11) {
      timeBranchIndex = 5; timeSlotName = '사시';
    } else if (hour >= 11 && hour < 13) {
      timeBranchIndex = 6; timeSlotName = '오시';
    } else if (hour >= 13 && hour < 15) {
      timeBranchIndex = 7; timeSlotName = '미시';
    } else if (hour >= 15 && hour < 17) {
      timeBranchIndex = 8; timeSlotName = '신시';
    } else if (hour >= 17 && hour < 19) {
      timeBranchIndex = 9; timeSlotName = '유시';
    } else if (hour >= 19 && hour < 21) {
      timeBranchIndex = 10; timeSlotName = '술시';
    } else if (hour >= 21 && hour < 23) {
      timeBranchIndex = 11; timeSlotName = '해시';
    }
  }
  
  const timeStemIndex = Math.abs((dayStemIndex * 2 + timeBranchIndex) % 10);
  const timePillar = heavenlyStems[timeStemIndex] + earthlyBranches[timeBranchIndex];

  return {
    name,
    gender,
    year,
    month,
    day,
    time: timeSlotName,
    yearPillar,
    monthPillar,
    dayPillar,
    timePillar
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SajuInput = await request.json();
    const { name, gender, birthDate, birthTime } = body;

    // 입력 검증
    if (!name || !gender || !birthDate || !birthTime) {
      return NextResponse.json({
        success: false,
        error: '필수 정보가 누락되었습니다.'
      }, { status: 400 });
    }

    // birthDate에서 년월일 추출
    const [year, month, day] = birthDate.split('-').map(Number);

    // 사주 계산
    const sajuData = calculateSaju(name, gender, year, month, day, birthTime);

    // 기본 사주 결과 생성
    const sajuResult = {
      id: `temp_${Date.now()}`,
      name: sajuData.name,
      gender: gender as 'male' | 'female',
      birthDate: birthDate,
      birthTime: sajuData.time,
      year_pillar: sajuData.yearPillar,
      month_pillar: sajuData.monthPillar,
      day_pillar: sajuData.dayPillar,
      hour_pillar: sajuData.timePillar,
      financial_fortune: '재물운이 안정적이며 꾸준한 수입이 예상됩니다.',
      personality: `일주 ${sajuData.dayPillar}을 바탕으로 보면, 차분하고 신중한 성격을 가지고 계십니다.`,
      fortune: '현재 운세는 전반적으로 안정적인 흐름을 보이고 있습니다.',
      career: '전문직이나 창의적인 분야에서 능력을 발휘할 것입니다.',
      love: '진실한 사랑을 만나 행복한 관계를 이루게 될 것입니다.',
      health: '건강 관리에 유의하시면 건강한 장수가 가능합니다.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Basic saju result:', sajuResult);

    // 사주 결과만 반환 (ChatGPT 분석은 별도 요청)
    return NextResponse.json({
      success: true,
      data: {
        sajuResult
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.'
    }, { status: 500 });
  }
} 