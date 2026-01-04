import { loginRouter } from "@/modules/auth/server/route";
import workspaces from "@/modules/workspaces/server/route";
import { Hono } from "hono";
import { handle } from "hono/netlify";

const app = new Hono().basePath("/api");
const routes = app
.route("/auth", loginRouter)
.route("/workspaces", workspaces)

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
