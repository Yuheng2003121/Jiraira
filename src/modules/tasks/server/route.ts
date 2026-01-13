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
      const { users } = await createAdminClient();

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
        queries:
          projectIds.length > 0 ? [Query.contains("$id", projectIds)] : [],
      });

      const members = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "members",
        queries:
          assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : [],
      });

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );
        const assignee = assignees.find(
          (member) => member.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

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
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>({
      databaseId: DATABASE_ID,
      collectionId: "tasks",
      documentId: taskId,
    });

    const member = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "You are not a member of this workspace" }, 401);
    }

    await databases.deleteDocument({
      databaseId: DATABASE_ID,
      collectionId: "tasks",
      documentId: taskId,
    });

    return c.json({ $id: task.$id });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { taskId } = c.req.param();
      const { name, status, assigneeId, projectId, dueDate, description } =
        c.req.valid("json");

      const existingTask = await databases.getDocument<Task>({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        documentId: taskId,
      });

      if (!existingTask) {
        return c.json(
          {
            message: "Task not found",
          },
          404
        );
      }

      const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json({ error: "You are not a member of this workspace" }, 401);
      }

      const task = await databases.updateDocument<Task>({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        documentId: existingTask.$id,
        data: {
          name,
          status,
          projectId,
          dueDate,
          assigneeId,
          description: description,
        },
      });

      return c.json(task);
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");
    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>({
      databaseId: DATABASE_ID,
      collectionId: "tasks",
      documentId: taskId,
    });

    const currentMember = await getMember({
      databases,
      workspaceId: task.workspaceId,
      userId: currentUser.$id,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument<Project>({
      databaseId: DATABASE_ID,
      collectionId: "projects",
      documentId: task.projectId,
    });

    const member = await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: "members",
      documentId: task.assigneeId,
    });

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      ...task,
      project,
      assignee,
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.enum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const {tasks} = c.req.valid('json');
      const databases = c.get("databases");
      const user = c.get("user");

      const tasksToUpdate = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "tasks",
        queries:[
          Query.contains("$id", tasks.map(task => task.$id))
        ]
      })

      const workspaceIds = new Set(tasksToUpdate.documents.map(task => task.workspaceId));
      if (workspaceIds.size !== 1) {
        return c.json({
          error: "Tasks must be in the same workspace"
        }, 400)
      }

      const workspaceId = workspaceIds.values().next().value;

      const member = await getMember({ databases, workspaceId, userId: user.$id })

      if (!member) {
        return c.json({
          message: "You are not a member of this workspace"
        }, 400)
      }

      
      const updatedTasks = await Promise.all(tasks.map(async (task) => {
        const {$id, status, position} = task;
        return databases.updateDocument({
          databaseId: DATABASE_ID,
          collectionId: "tasks",
          documentId: $id,
          data: {
            status,
            position
          }
        })
      }))

      return c.json(updatedTasks);
    }
  );

export default tasks;
