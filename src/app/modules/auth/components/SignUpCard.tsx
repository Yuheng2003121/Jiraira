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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signupSchema } from "../schema";
import { useSignup } from "../api/use-signup";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";



interface SignUpCardProps {
  redirectTo?: string;
}
export default function SignUpCard({ redirectTo }: SignUpCardProps) {
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const { mutate: signup, isPending } = useSignup();

  const router = useRouter();
  const queryClient = useQueryClient();
  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    signup(values, {
      onError: () => {},
      onSuccess: () => {
        router.push(redirectTo || "/")
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        router.refresh();
      },
    });
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Card className="w-full md:w-122 border-none">
      <CardHeader className="flex flex-col items-center py-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By Signing up, you agree to our{" "}
          <Link href="/privacy" className="text-blue-700">
            Privacy Policy.
          </Link>
        </CardDescription>
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
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        className="pr-12!"
                      />
                      <span
                        className="text-muted-foreground absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                      >
                        {isPasswordVisible ? (
                          <EyeOffIcon className="size-6" />
                        ) : (
                          <EyeIcon className="size-6" />
                        )}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Link
              href="/sign-in"
              className="ml-auto text-sm hover:text-blue-600 font-semibold hover:underline"
            >
              {"Already have an account?"}
            </Link>

            <Button
              type="submit"
              size={"lg"}
              className="cursor-pointer"
              disabled={isPending}
            >
              Sign up
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
