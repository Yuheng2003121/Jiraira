import { DATABASE_ID, IMAGES_BUCKET_ID } from "@/constants";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "@/modules/members/utils";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import z from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { Project } from "../types";
import { MemberRole } from "@/modules/members/types";

const projects = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { workspaceId } = c.req.valid("query");
      if (!workspaceId) {
        return c.json(
          {
            error: "Workspace ID is required",
          },
          400
        );
      }

      const member = getMember({ databases, workspaceId, userId: user.$id });
      if (!member) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      const projects = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        queries: [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
        ],
      });

      return c.json(projects);
    }
  )
  .get(
    "/:projectId",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          { error: "You are not authorized to view this project" },
          401
        );
      }

      const project = await databases.getDocument({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: projectId,
      });

      return c.json(project);
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image, workspaceId } = c.req.valid("form");

      if (!workspaceId) {
        return c.json(
          {
            error: "Workspace ID is required",
          },
          400
        );
      }

      const member = getMember({ databases, workspaceId, userId: user.$id });
      if (!member) {
        return c.json(
          {
            error: "Unauthorized",
          },
          401
        );
      }

      let uploadImageUrl: string | undefined;
      let fileId: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile({
          bucketId: IMAGES_BUCKET_ID,
          fileId: ID.unique(),
          file: image,
        });
        fileId = file.$id;

        const arrayBuffer = await storage.getFileView({
          bucketId: IMAGES_BUCKET_ID,
          fileId: fileId,
        });

        uploadImageUrl = `data:${file.mimeType};base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: ID.unique(),
        data: {
          name,
          imageUrl: uploadImageUrl,
          workspaceId,
        },
      });

      return c.json(project);
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: projectId,
      });

      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          { error: "You are not authorized to update this project" },
          401
        );
      }

      let uploadImageUrl: string | undefined;
      let fileId: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile({
          bucketId: IMAGES_BUCKET_ID,
          fileId: ID.unique(),
          file: image,
        });
        fileId = file.$id;

        const arrayBuffer = await storage.getFileView({
          bucketId: IMAGES_BUCKET_ID,
          fileId: fileId,
        });

        uploadImageUrl = `data:${file.mimeType};base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else if (typeof image === "string") {
        uploadImageUrl = image;
      }

      const updatedProject = await databases.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: projectId,
        data: {
          name,
          imageUrl: uploadImageUrl,
        },
      });

      return c.json(updatedProject);
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
  
      const { projectId } = c.req.param();
      const existingProject = await databases.getDocument<Project>({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: projectId,
      });
  
      const member = await getMember({
        databases,
        workspaceId: existingProject.workspaceId,
        userId: user.$id,
      });
  
      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "You are not authorized to delete this project" },
          401
        );
      }
  
      await databases.deleteDocument({
        databaseId: DATABASE_ID,
        collectionId: "projects",
        documentId: projectId,
      });
  
      return c.json({ $id: projectId });
    })

export default projects;
