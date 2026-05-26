import { NextResponse } from 'next/server';
import { signRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { role } = await req.json();
    if (role !== 'admin' && role !== 'staff') {
      return NextResponse.json(
        { success: false, error: '⚠️ 無效的角色類型 (Invalid role)' },
        { status: 400 }
      );
    }

    // 簽署加密 Token
    const token = signRole(role);

    const response = NextResponse.json({
      success: true,
      role,
      message: `🔐 成功發行密碼學 Session 金鑰：[${role}]。已成功阻斷前端明文竄改通道。`
    });

    const isProd = process.env.NODE_ENV === 'production';
    
    // 寫入加密安全 HttpOnly Cookie
    response.cookies.set('user-session', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      maxAge: 86400, // 24 小時
      path: '/'
    });

    // 同步寫入普通視覺 Cookie，供前台 UI 組件渲染狀態使用 (唯讀/非安全判斷基準)
    response.cookies.set('user-role', role, {
      secure: isProd,
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '🔥 發行金鑰內部錯誤：' + error.message },
      { status: 500 }
    );
  }
}
