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

// 월령 지지 (간략화)
const monthBranches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0]; // 인월부터 시작

// 사주 데이터 타입
interface SajuData {
  name: string;
  gender: string;
  year: number;
  month: number;
  day: number;
  time: string;
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  timePillar: string;
}

// ChatGPT 응답 타입 정의
interface AnalysisResponse {
  id: string;
  message: string;
  timestamp: string;
}

// UUID 생성 함수 (브라우저 호환성 개선)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // fallback UUID 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function calculateSaju(
  name: string,
  gender: string,
  year: number,
  month: number,
  day: number,
  timeString: string
): SajuData {
  // 연주 계산 (기준년도 1984년을 갑자년으로 설정)
  const yearOffset = (year - 1984) % 60;
  const yearStemIndex = Math.abs(yearOffset % 10);
  const yearBranchIndex = Math.abs(yearOffset % 12);
  const yearPillar = heavenlyStems[yearStemIndex] + earthlyBranches[yearBranchIndex];

  // 월주 계산 (간략화된 버전)
  const monthBranchIndex = monthBranches[month - 1];
  const monthStemIndex = Math.abs((yearStemIndex * 2 + month) % 10);
  const monthPillar = heavenlyStems[monthStemIndex] + earthlyBranches[monthBranchIndex];

  // 일주 계산 (간략화된 버전 - 실제로는 더 복잡한 계산 필요)
  const baseDate = new Date(1984, 0, 1); // 갑자일로 설정
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const dayOffset = Math.abs(daysDiff % 60);
  const dayStemIndex = Math.abs(dayOffset % 10);
  const dayBranchIndex = Math.abs(dayOffset % 12);
  const dayPillar = heavenlyStems[dayStemIndex] + earthlyBranches[dayBranchIndex];

  // 시주 계산 - 시간 문자열을 숫자로 변환하여 시주 결정
  let timeBranchIndex = 0;
  let timeSlotName = '자시';
  
  if (timeString) {
    const hour = parseInt(timeString.split(':')[0], 10);
    
    if (hour >= 23 || hour < 1) {
      timeBranchIndex = 0;
      timeSlotName = '자시';
    } else if (hour >= 1 && hour < 3) {
      timeBranchIndex = 1;
      timeSlotName = '축시';
    } else if (hour >= 3 && hour < 5) {
      timeBranchIndex = 2;
      timeSlotName = '인시';
    } else if (hour >= 5 && hour < 7) {
      timeBranchIndex = 3;
      timeSlotName = '묘시';
    } else if (hour >= 7 && hour < 9) {
      timeBranchIndex = 4;
      timeSlotName = '진시';
    } else if (hour >= 9 && hour < 11) {
      timeBranchIndex = 5;
      timeSlotName = '사시';
    } else if (hour >= 11 && hour < 13) {
      timeBranchIndex = 6;
      timeSlotName = '오시';
    } else if (hour >= 13 && hour < 15) {
      timeBranchIndex = 7;
      timeSlotName = '미시';
    } else if (hour >= 15 && hour < 17) {
      timeBranchIndex = 8;
      timeSlotName = '신시';
    } else if (hour >= 17 && hour < 19) {
      timeBranchIndex = 9;
      timeSlotName = '유시';
    } else if (hour >= 19 && hour < 21) {
      timeBranchIndex = 10;
      timeSlotName = '술시';
    } else if (hour >= 21 && hour < 23) {
      timeBranchIndex = 11;
      timeSlotName = '해시';
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

export function generateAnalysis(sajuData: SajuData): AnalysisResponse {
  const analysis = `## ${sajuData.name}님의 사주팔자 분석

### 📅 기본 정보
- **성별**: ${sajuData.gender === 'male' ? '남성' : '여성'}
- **생년월일**: ${sajuData.year}년 ${sajuData.month}월 ${sajuData.day}일
- **출생시간**: ${sajuData.time}

### 🔮 사주팔자
- **연주(年柱)**: ${sajuData.yearPillar} - 조상운과 초년운을 나타냅니다
- **월주(月柱)**: ${sajuData.monthPillar} - 부모운과 청년운을 나타냅니다  
- **일주(日柱)**: ${sajuData.dayPillar} - 본인의 성격과 배우자운을 나타냅니다
- **시주(時柱)**: ${sajuData.timePillar} - 자녀운과 말년운을 나타냅니다

### ✨ 종합 분석

**성격 분석**: 
일주 ${sajuData.dayPillar}을 바탕으로 보면, 차분하고 신중한 성격을 가지고 계십니다. 

**운세 전망**:
현재 운세는 전반적으로 안정적인 흐름을 보이고 있습니다.

**주의사항**:
사주팔자는 참고용이며, 개인의 노력과 선택이 더욱 중요합니다.

*이 분석은 전통 명리학을 바탕으로 한 일반적인 해석입니다.*`;

  return {
    id: generateUUID(),
    message: analysis,
    timestamp: new Date().toISOString()
  };
} 