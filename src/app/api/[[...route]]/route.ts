import { loginRouter } from "@/modules/auth/server/route";
import members from "@/modules/members/server/route";
import workspaces from "@/modules/workspaces/server/route";
import { Hono } from "hono";
import { handle } from "hono/netlify";

const app = new Hono().basePath("/api");
const routes = app
.route("/auth", loginRouter)
.route("/workspaces", workspaces)
.route("/members", members)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);


export type AppType = typeof routes;
