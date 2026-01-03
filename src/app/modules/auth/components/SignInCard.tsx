"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import DottedSeparator from "@/components/DottedSeparator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { loginSchema } from "../schema";
import { useLogin } from "../api/use-login";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface SignInCardProps {
  redirectTo?: string;
}
export default function SignInCard({ redirectTo }: SignInCardProps) {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    login(values, {
      onSuccess: () => {
        // 先跳转（无白屏）
        router.push(redirectTo || "/");

        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        // 再刷新新页面的数据（确保 Server Components 获取最新用户态）
        router.refresh();
      },
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
    });
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Card className="w-full md:w-122 border-none">
      <CardHeader className="flex justify-center py-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email address"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type={isPasswordVisible ? "text" : "password"}
                      />
                      <span
                        className="text-muted-foreground absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                      >
                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              href={{
                pathname: "/sign-up",
                query: redirectTo ? { redirect: redirectTo } : {},
              }}
              className="ml-auto text-sm hover:text-blue-600 font-semibold hover:underline"
            >
              {"Don't have account?"}
            </Link>

            <Button
              type="submit"
              size={"lg"}
              className="cursor-pointer"
              disabled={isPending}
            >
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col gap-6">
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="cursor-pointer w-full"
        >
          <FcGoogle className="size-5" />
          Log in with Google
        </Button>
        <Button
          disabled={isPending}
          variant={"secondary"}
          size={"lg"}
          className="cursor-pointer w-full"
        >
          <FaGithub className="size-5" />
          Log in with Github
        </Button>
      </CardContent>
    </Card>
  );
}
