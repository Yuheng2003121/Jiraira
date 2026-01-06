import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/constants";
import { MemberRole } from "@/modules/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/modules/members/utils";
import z from "zod";
import { Workspace } from '../types';

const workspaces = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: "members",
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return c.json({ documents: [], total: 0 });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json(workspaces);
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        { error: "You are not authorized to view this workspace" },
        401
      );
    }

    const workspace = await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: "workspaces",
      documentId: workspaceId,
    });

    return c.json(workspace);
  })

  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

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

      const workspace = await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: WORKSPACES_ID,
        documentId: ID.unique(),
        data: {
          name,
          userId: user.$id,
          imageUrl: uploadImageUrl,
          inviteCode: generateInviteCode(6),
        },
      });

      await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: "members",
        documentId: ID.unique(),
        data: {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        },
      });

      return c.json(workspace);
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "You are not authorized to update this workspace" },
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

      const updatedWorkspace = await databases.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: "workspaces",
        documentId: workspaceId,
        data: {
          name,
          imageUrl: uploadImageUrl,
        },
      });

      return c.json(updatedWorkspace);
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        { error: "You are not authorized to delete this workspace" },
        401
      );
    }

    await databases.deleteDocument({
      databaseId: DATABASE_ID,
      collectionId: "workspaces",
      documentId: workspaceId,
    });

    return c.json({ $id: workspaceId });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        { error: "You are not authorized to delete this workspace" },
        401
      );
    }

    const worksapce = await databases.updateDocument({
      databaseId: DATABASE_ID,
      collectionId: "workspaces",
      documentId: workspaceId,
      data: {
        inviteCode: generateInviteCode(6),
      },
    });

    return c.json(worksapce);
  })
  .post(
    '/:workspaceId/join',
    sessionMiddleware,
    zValidator("json",z.object({inviteCode: z.string()})),
    async (c) => {
      const {workspaceId} = c.req.param();
      const {inviteCode} = c.req.valid('json');

      const databases = c.get('databases');
      const user = c.get('user');

      const member = await getMember({
        workspaceId,
        userId: user.$id,
        databases
      })

      if (member) {
        return c.json({error: 'You are already a member of this workspace'}, 400)
      }

      const workspace = await databases.getDocument<Workspace>({
        databaseId: DATABASE_ID,
        collectionId: 'workspaces',
        documentId: workspaceId
      })

      if (workspace.inviteCode !== inviteCode) {
        return c.json({error: 'Invalid invite code'}, 400)
      }

      await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: 'members',
        documentId: ID.unique(),
        data: {
          userId: user.$id,
          workspaceId,
          role: MemberRole.MEMBER
        }
      })

      return c.json(workspace);

    }
  )

export default workspaces;
