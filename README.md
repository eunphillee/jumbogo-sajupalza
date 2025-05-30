# 점보고 - 사주팔자 웹사이트

![점보고 로고](public/jubogo_log.png)

## 📖 프로젝트 소개

점보고는 전통 명리학과 최신 AI 기술을 결합한 현대적인 사주팔자 분석 웹사이트입니다. 
정확한 명리학 계산과 ChatGPT AI의 전문적인 해석을 통해 개인 맞춤형 운세 분석을 제공합니다.

## ✨ 주요 기능

- **🎯 정확한 사주팔자 계산**: 전통 명리학 이론 기반의 신뢰할 수 있는 계산
- **🤖 AI 맞춤 분석**: ChatGPT를 활용한 전문적이고 상세한 해석
- **🔒 완벽한 보안**: 개인정보 안전 보호 및 데이터 암호화
- **📱 반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- **⚡ 빠른 성능**: Next.js 15 기반의 최신 웹 기술

## 🛠️ 기술 스택

### Frontend
- **Next.js 15**: React 기반 풀스택 프레임워크
- **React 19**: 최신 React 버전
- **TypeScript**: 타입 안전성을 위한 정적 타입 언어
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크

### Backend & Database
- **Supabase**: PostgreSQL 기반 백엔드 서비스
- **OpenAI API**: ChatGPT 기반 AI 분석

### 배포
- **Vercel**: 프로덕션 배포 플랫폼
- **도메인**: www.jumbogo.co.kr

## 🚀 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/[YOUR_USERNAME]/jumbogo-sajupalza.git
cd jumbogo-sajupalza
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── saju/         # 사주 계산 API
│   │   └── chatgpt/      # ChatGPT 분석 API
│   ├── globals.css       # 전역 스타일
│   ├── layout.tsx        # 루트 레이아웃
│   └── page.tsx          # 홈페이지
├── components/            # React 컴포넌트
│   ├── SajuForm.tsx      # 사주 입력 폼
│   └── SajuResult.tsx    # 사주 결과 표시
├── lib/                  # 유틸리티 라이브러리
│   ├── supabase.ts       # Supabase 클라이언트
│   └── openai.ts         # OpenAI 클라이언트
├── types/                # TypeScript 타입 정의
│   └── index.ts
└── utils/                # 유틸리티 함수
    └── saju.ts           # 사주 계산 로직
```

## 🎨 주요 컴포넌트

### SajuForm
- 사용자 정보 입력 (이름, 성별, 생년월일, 시주)
- 전통 명리학의 12시진 시스템 적용
- 실시간 유효성 검증

### SajuResult
- 사주팔자 계산 결과 표시
- ChatGPT AI 분석 연동
- 상세한 운세 해석 제공

## 🔧 API 엔드포인트

### POST /api/saju
사주팔자 계산 및 기본 분석
```json
{
  "name": "홍길동",
  "gender": "male",
  "birthDate": "1990-01-01",
  "birthTime": "09:00",
  "birthLocation": ""
}
```

### POST /api/chatgpt
ChatGPT 기반 상세 분석
```json
{
  "sajuResult": {
    // 사주 계산 결과 객체
  }
}
```

## 🌟 특징

- **전통과 현대의 조화**: 고전 명리학과 최신 AI 기술의 완벽한 결합
- **사용자 중심 설계**: 직관적이고 사용하기 쉬운 인터페이스
- **모바일 최적화**: 모든 디바이스에서 완벽한 사용자 경험
- **보안 강화**: 개인정보 보호를 위한 최고 수준의 보안

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 👥 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

- 웹사이트: [www.jumbogo.co.kr](https://www.jumbogo.co.kr)
- 이메일: contact@jumbogo.co.kr

---

**점보고** - 당신의 운명을 AI와 함께 탐험하세요 ✨ 