import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { loginSchema, signupSchema } from "../schema";
import { createAdminClient } from "@/lib/appwrite";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { sessionMiddleware } from "@/lib/session-middleware";

export const loginRouter = new Hono()
  .get("/current", sessionMiddleware, async (c) => {
    const user = c.get("user");

    return c.json({ data: user });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    (await cookies()).set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: "true", message: "Login in successfully" });
  })
  .post("register", zValidator("json", signupSchema), async (c) => {
    const { email, password, userName: name } = c.req.valid("json");

    const { account } = await createAdminClient();

    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    (await cookies()).set(AUTH_COOKIE, session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("logout", sessionMiddleware, async (c) => {
    //因为登出必须知道「是谁要登出」→ 需要先验证 session 有效。
    const account = c.get("account"); //这里的account是在sessionMiddleware存入的

    (await cookies()).delete(AUTH_COOKIE);//删除客户端凭证

    // 删除服务端session
    await account.deleteSession({
      sessionId: "current",
    });

    return c.json({ success: true });
  });
