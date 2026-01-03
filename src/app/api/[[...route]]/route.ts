import { loginRouter } from "@/app/modules/auth/server/route";
import { Hono } from "hono";
import { handle } from "hono/netlify";

const app = new Hono().basePath("/api");
const routes = app.route("/auth", loginRouter);
 
export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
