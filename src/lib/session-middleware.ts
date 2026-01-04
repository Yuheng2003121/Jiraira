import { AUTH_COOKIE } from "@/modules/auth/constants";
import { createMiddleware } from "hono/factory";
import { cookies } from "next/headers";
import {
  Account,
  Client,
  Databases,
  Models,
  Users,
  Storage,
} from "node-appwrite";

type Context = {
  Variables: {
    account: Account;
    databases: Databases;
    storage: Storage;
    users: Users;
    user: Models.User<Models.Preferences>;
  };
};

export const sessionMiddleware = createMiddleware<Context>(async (c, next) => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = await (await cookies()).get(AUTH_COOKIE);
  if (!session || !session.value) {
    return c.json({ error: "Unauthenticated" }, 401);
  }

  client.setSession(session.value);

  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);
  const user = await account.get();

  c.set("account", account);
  c.set("databases", databases);
  c.set("storage", storage);
  c.set("user", user);

  await next();
});
