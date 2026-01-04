import { getCurrentUser } from "@/modules/auth/api/getCurrentUser";
import SignUpCard from "@/modules/auth/components/SignUpCard";
import { redirect } from "next/navigation";
import React from "react";

interface SignUpPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  // 1. 获取并解析重定向参数
  const { redirect: rawRedirect } = await searchParams;
  const redirectTo = Array.isArray(rawRedirect) ? rawRedirect[0] : rawRedirect;

  // 2. 验证安全性：确保路径是以 / 开头的站内路径
  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";

  return <SignUpCard redirectTo={safeRedirect} />;
}
