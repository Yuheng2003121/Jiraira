import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "./modules/auth/constants";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE);
  const { pathname, search } = request.nextUrl;

  // 如果没有 Session 且不是去往登录页
  if (!session && !pathname.startsWith("/sign-in")) {
    // 构建完整的原始路径
    const fullPath = `${pathname}${search}`;
    const loginUrl = new URL("/sign-in", request.url);

    // 添加 redirect 参数
    loginUrl.searchParams.set("redirect", fullPath);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 配置中间件运行的路径
export const config = {
  matcher: [
    /*
     * 匹配所有需要保护的路径，排除以下：
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化文件)
     * - favicon.ico (浏览器图标)
     * - sign-in, sign-up (登录注册页)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|.*\\..*).*)",
  ],
};
