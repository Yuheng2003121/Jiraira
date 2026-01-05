"use client";

import { useGetWorkspaces } from "@/modules/workspaces/api/use-get-workspaces";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const router = useRouter();

  useEffect(() => {
    // 等数据加载完成再跳转
    if (!isLoading && data) {
      if (data.total === 0) {
        router.push("/workspaces/create");
      } else if (data.documents && data.documents.length > 0) {
        router.push(`/workspaces/${data.documents[0].$id}`);
      }
      // ❗ 若 data.documents 为空但 total > 0（异常情况），可加兜底逻辑
    }
  }, [data, isLoading, router]); // 依赖 data & loading 状态

  // 可选：加 loading 状态避免闪屏
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoaderCircle className="animate-spin text-muted-foreground"/>
      </div>
    );
  }

  // 正常情况：跳转已触发，此处不渲染内容
  //  return (
  //    <div className="flex h-full items-center justify-center">
  //      <LoaderCircle className="animate-spin text-muted-foreground" />
  //    </div>
  //  );
   return null;
}
