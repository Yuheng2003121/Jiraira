import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/modules/auth/api/getCurrentUser";
import SignInCard from "@/app/modules/auth/components/SignInCard";

interface SignInPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  // 1. 获取并解析重定向参数
  const { redirect: rawRedirect } = await searchParams;
  const redirectTo = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect;
  
  // 2. 验证安全性：确保路径是以 / 开头的站内路径
  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";

  // 3. 检查用户是否已经登录
  const user = await getCurrentUser();

  // 如果已登录，直接跳走，不需要再看登录页
  if (user) {
    redirect(safeRedirect);
  }

  // 4. 未登录，渲染登录组件
  return (
      <SignInCard redirectTo={safeRedirect} />
  );
}
