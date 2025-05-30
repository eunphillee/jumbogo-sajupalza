import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateBasicSaju } from '@/utils/saju';
import { SajuInput, SajuResult, ApiResponse } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: SajuInput = await request.json();
    
    // 입력값 검증
    if (!body.name || !body.gender || !body.birthDate || !body.birthTime) {
      return NextResponse.json({
        success: false,
        error: '필수 정보가 누락되었습니다.',
      } as ApiResponse<null>, { status: 400 });
    }

    // 사주팔자 계산
    const sajuCalculation = calculateBasicSaju(body);
    
    // 데이터베이스에 저장할 데이터 준비
    const sajuData: Omit<SajuResult, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: body.name,
      gender: body.gender,
      birthDate: body.birthDate,
      birthTime: body.birthTime,
      birthLocation: body.birthLocation || '',
      year_pillar: sajuCalculation.year_pillar || '',
      month_pillar: sajuCalculation.month_pillar || '',
      day_pillar: sajuCalculation.day_pillar || '',
      hour_pillar: sajuCalculation.hour_pillar || '',
      compatibility: sajuCalculation.compatibility || '',
      fortune: sajuCalculation.fortune || '',
      personality: sajuCalculation.personality || '',
      career: sajuCalculation.career || '',
      love: sajuCalculation.love || '',
      health: sajuCalculation.health || '',
    };

    // Supabase 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
      // 데모 모드 - 데이터베이스 저장 없이 결과만 반환
      return NextResponse.json({
        success: true,
        data: {
          ...sajuData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        message: '사주팔자가 성공적으로 계산되었습니다. (데모 모드)',
      } as ApiResponse<SajuResult>);
    }

    // Supabase에 데이터 저장
    const { data, error } = await supabaseAdmin
      .from('saju_results')
      .insert(sajuData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      // Supabase 에러가 발생해도 계산된 결과는 반환
      return NextResponse.json({
        success: true,
        data: {
          ...sajuData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        message: '사주팔자가 성공적으로 계산되었습니다. (저장 실패)',
      } as ApiResponse<SajuResult>);
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: '사주팔자가 성공적으로 계산되었습니다.',
    } as ApiResponse<SajuResult>);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.',
    } as ApiResponse<null>, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: '사주 결과 ID가 필요합니다.',
      } as ApiResponse<null>, { status: 400 });
    }

    // Supabase 환경 변수 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
      return NextResponse.json({
        success: false,
        error: '데모 모드에서는 저장된 데이터를 조회할 수 없습니다.',
      } as ApiResponse<null>, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('saju_results')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: '사주 결과를 찾을 수 없습니다.',
      } as ApiResponse<null>, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: data,
    } as ApiResponse<SajuResult>);

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다.',
    } as ApiResponse<null>, { status: 500 });
  }
} 