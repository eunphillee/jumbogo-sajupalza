import { SajuInput, SajuResult } from '@/types';

// 십간 (天干)
const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];

// 십이지 (地支)
const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

// 띠 동물
const zodiacAnimals = ['쥐', '소', '범', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

/**
 * 날짜를 기반으로 사주팔자의 기본 기둥들을 계산합니다.
 * 실제 사주 계산은 매우 복잡하므로, 여기서는 간단한 예시를 제공합니다.
 * 실제 프로덕션에서는 정확한 사주 계산 라이브러리나 API를 사용해야 합니다.
 */
export function calculateBasicSaju(input: SajuInput): Partial<SajuResult> {
  const birthDate = new Date(input.birthDate);
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const [hour] = input.birthTime.split(':').map(Number);

  // 년주 계산 (기준년도 1924년을 갑자년으로 설정)
  const yearIndex = (year - 1924) % 60;
  const yearStem = heavenlyStems[yearIndex % 10];
  const yearBranch = earthlyBranches[yearIndex % 12];
  const yearPillar = `${yearStem}${yearBranch}`;

  // 월주 계산 (간단한 계산)
  const monthIndex = ((year - 1924) * 12 + month - 1) % 60;
  const monthStem = heavenlyStems[monthIndex % 10];
  const monthBranch = earthlyBranches[monthIndex % 12];
  const monthPillar = `${monthStem}${monthBranch}`;

  // 일주 계산 (간단한 계산)
  const daysSince1924 = Math.floor((birthDate.getTime() - new Date('1924-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const dayIndex = daysSince1924 % 60;
  const dayStem = heavenlyStems[dayIndex % 10];
  const dayBranch = earthlyBranches[dayIndex % 12];
  const dayPillar = `${dayStem}${dayBranch}`;

  // 시주 계산
  const hourIndex = (dayIndex * 12 + Math.floor(hour / 2)) % 60;
  const hourStem = heavenlyStems[hourIndex % 10];
  const hourBranch = earthlyBranches[hourIndex % 12];
  const hourPillar = `${hourStem}${hourBranch}`;

  // 띠 계산
  const zodiacIndex = (year - 1924) % 12;
  const zodiac = zodiacAnimals[zodiacIndex];

  return {
    year_pillar: yearPillar,
    month_pillar: monthPillar,
    day_pillar: dayPillar,
    hour_pillar: hourPillar,
    compatibility: `${zodiac}띠 - 기본 궁합 정보`,
    fortune: generateBasicFortune(yearPillar, input.gender),
    personality: generateBasicPersonality(dayStem),
    career: generateBasicCareer(monthStem),
    love: generateBasicLove(dayBranch, input.gender),
    health: generateBasicHealth(hourStem),
  };
}

function generateBasicFortune(yearPillar: string, gender: 'male' | 'female'): string {
  const fortunes = [
    '올해는 새로운 기회가 많이 찾아올 것입니다.',
    '인내심을 가지고 꾸준히 노력하면 좋은 결과가 있을 것입니다.',
    '대인관계에서 좋은 만남이 있을 예정입니다.',
    '재물운이 상승하는 시기입니다.',
    '건강에 주의하시고 무리하지 마세요.',
  ];
  return fortunes[yearPillar.charCodeAt(0) % fortunes.length];
}

function generateBasicPersonality(dayStem: string): string {
  const personalities: { [key: string]: string } = {
    '갑': '리더십이 강하고 진취적인 성격입니다.',
    '을': '부드럽고 섬세한 성격으로 남을 잘 배려합니다.',
    '병': '열정적이고 활동적인 성격입니다.',
    '정': '온화하고 인정이 많은 성격입니다.',
    '무': '안정적이고 신중한 성격입니다.',
    '기': '포용력이 크고 너그러운 성격입니다.',
    '경': '강인하고 의지력이 강한 성격입니다.',
    '신': '깔끔하고 정리정돈을 좋아하는 성격입니다.',
    '임': '유연하고 적응력이 뛰어난 성격입니다.',
    '계': '섬세하고 감성이 풍부한 성격입니다.',
  };
  return personalities[dayStem] || '균형잡힌 성격을 가지고 있습니다.';
}

function generateBasicCareer(monthStem: string): string {
  const careers: { [key: string]: string } = {
    '갑': '경영, 리더십을 발휘할 수 있는 직업이 적합합니다.',
    '을': '예술, 디자인, 서비스업이 적합합니다.',
    '병': '언론, 교육, 영업 분야가 적합합니다.',
    '정': '요리, 화학, 제조업이 적합합니다.',
    '무': '건설, 부동산, 농업이 적합합니다.',
    '기': '상담, 중개, 유통업이 적합합니다.',
    '경': '기계, 금융, 법률 분야가 적합합니다.',
    '신': '보석, 정밀기계, IT 분야가 적합합니다.',
    '임': '무역, 운송, 음료업이 적합합니다.',
    '계': '연구, 학술, 의료 분야가 적합합니다.',
  };
  return careers[monthStem] || '다양한 분야에서 능력을 발휘할 수 있습니다.';
}

function generateBasicLove(dayBranch: string, gender: 'male' | 'female'): string {
  const loveAdvice = [
    '진실한 사랑을 만날 운명입니다.',
    '상대방의 마음을 잘 헤아리는 것이 중요합니다.',
    '적극적으로 다가가면 좋은 결과가 있을 것입니다.',
    '인내심을 가지고 기다리면 좋은 인연이 찾아옵니다.',
    '주변 사람들의 소개로 좋은 만남이 있을 수 있습니다.',
  ];
  return loveAdvice[dayBranch.charCodeAt(0) % loveAdvice.length];
}

function generateBasicHealth(hourStem: string): string {
  const healthAdvice = [
    '규칙적인 운동과 식습관 관리가 중요합니다.',
    '스트레스 관리에 특히 신경쓰세요.',
    '충분한 수면과 휴식을 취하세요.',
    '정기적인 건강검진을 받으시기 바랍니다.',
    '과로를 피하고 적절한 휴식을 취하세요.',
  ];
  return healthAdvice[hourStem.charCodeAt(0) % healthAdvice.length];
} 