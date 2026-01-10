import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schema";
import { getMember } from "@/modules/members/utils";
import { DATABASE_ID } from "@/constants";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { Task, TaskStatus } from "../types";
import { Project } from "@/modules/projects/types";
import { createAdminClient } from "@/lib/appwrite";

const tasks = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.enum(TaskStatus).nullish(),
        search: z.string().nullish(),
        dueDate: z.string().nullish(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      // const users = c.get("users");
      const databases = c.get("databases");
      const {users} = await createAdminClient();
 
      const { workspaceId, projectId, assigneeId, status, search, dueDate } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId: workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "You are not a member of this workspace" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderAsc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        queries: query,
      });

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        queries: projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      });

      const members = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "members",
        queries: assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      });

      const assignees = await Promise.all(members.documents.map(async (member) => {
        const user = await users.get(member.userId);
        return {
          ...member,
          name: user.name,
          email: user.email,
        };
      }))

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find((project) => project.$id === task.projectId);
        const assignee = assignees.find((member) => member.$id === task.assigneeId);

        return {
          ...task,
          project,
          assignee,
        };
      })

      return c.json(populatedTasks);
    }
  )

  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { name, status, assigneeId, projectId, dueDate, workspaceId } =
        c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "You are not a member of this workspace" }, 401);
      }

      const highestPositionTask = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        queries: [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ],
      });

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        documentId: ID.unique(),
        data: {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneeId,
          position: newPosition,
        },
      });

      return c.json(task);
    }
  );

export default tasks;
