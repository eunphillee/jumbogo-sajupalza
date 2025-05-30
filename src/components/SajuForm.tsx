'use client';

import { useState } from 'react';
import { SajuInput } from '@/types';

interface SajuFormProps {
  onSubmit: (data: SajuInput) => void;
  loading?: boolean;
}

export default function SajuForm({ onSubmit, loading = false }: SajuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
  });

  // 시주 옵션 (자시부터 해시까지)
  const timeOptions = [
    { value: '23-01', label: '자시 (23:00-01:00)' },
    { value: '01-03', label: '축시 (01:00-03:00)' },
    { value: '03-05', label: '인시 (03:00-05:00)' },
    { value: '05-07', label: '묘시 (05:00-07:00)' },
    { value: '07-09', label: '진시 (07:00-09:00)' },
    { value: '09-11', label: '사시 (09:00-11:00)' },
    { value: '11-13', label: '오시 (11:00-13:00)' },
    { value: '13-15', label: '미시 (13:00-15:00)' },
    { value: '15-17', label: '신시 (15:00-17:00)' },
    { value: '17-19', label: '유시 (17:00-19:00)' },
    { value: '19-21', label: '술시 (19:00-21:00)' },
    { value: '21-23', label: '해시 (21:00-23:00)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 날짜 형식을 YYYY-MM-DD로 변환
    const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
    
    // 시주에서 시간 추출 (예: "09-11" -> "09:00")
    const birthTime = formData.birthHour ? `${formData.birthHour.split('-')[0]}:00` : '';
    
    const sajuInput: SajuInput = {
      name: formData.name,
      gender: formData.gender as 'male' | 'female',
      birthDate,
      birthTime,
      birthLocation: '', // 출생지 삭제
    };
    
    onSubmit(sajuInput);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        사주팔자 정보 입력
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="label">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div>
          <label htmlFor="gender" className="label">
            성별 <span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>

        <div>
          <label className="label">
            생년월일 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <input
                type="number"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                required
                min="1900"
                max="2024"
                className="input-field text-center"
                placeholder="연도"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">연도 (4자리)</p>
            </div>
            <div>
              <input
                type="number"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                required
                min="1"
                max="12"
                className="input-field text-center"
                placeholder="월"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">월</p>
            </div>
            <div>
              <input
                type="number"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                required
                min="1"
                max="31"
                className="input-field text-center"
                placeholder="일"
              />
              <p className="text-xs text-gray-500 mt-1 text-center">일</p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="birthHour" className="label">
            출생시간 (시주) <span className="text-red-500">*</span>
          </label>
          <select
            id="birthHour"
            name="birthHour"
            value={formData.birthHour}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">시주를 선택하세요</option>
            {timeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            정확한 출생시간을 모르시면 대략적인 시주를 선택해주세요.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '사주 계산 중...' : '사주팔자 보기'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">안내사항</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 정확한 출생정보를 입력해주시면 더 정확한 사주팔자를 확인할 수 있습니다.</li>
          <li>• 음력 날짜의 경우 양력으로 변환하여 입력해주세요.</li>
          <li>• 시주는 전통 명리학의 12시진 기준입니다.</li>
          <li>• 입력하신 정보는 사주 계산에만 사용됩니다.</li>
        </ul>
      </div>
    </div>
  );
} 