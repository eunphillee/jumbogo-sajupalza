// 사주 관련 타입 정의
export interface SajuInput {
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // YYYY-MM-DD 형식
  birthTime: string; // HH:MM 형식
  birthLocation?: string; // 출생지 (선택사항)
}

export interface SajuResult {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime: string;
  birthLocation?: string;
  // 사주팔자 정보
  year_pillar: string; // 년주
  month_pillar: string; // 월주
  day_pillar: string; // 일주
  hour_pillar: string; // 시주
  // 추가 분석 정보
  compatibility: string; // 궁합
  fortune: string; // 운세
  personality: string; // 성격
  career: string; // 직업운
  love: string; // 연애운
  health: string; // 건강운
  created_at: string;
  updated_at: string;
}

export interface ChatGPTResponse {
  interpretation: string;
  summary: string;
  recommendations: string[];
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Supabase 데이터베이스 테이블 타입
export interface Database {
  public: {
    Tables: {
      saju_results: {
        Row: SajuResult;
        Insert: Omit<SajuResult, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SajuResult, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 