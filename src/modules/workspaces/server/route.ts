import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schema";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/constants";
import { MemberRole } from "@/modules/members/types";
import { generateInviteCode } from "@/lib/utils";

const workspaces = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: "members",
      queries: [
        Query.equal("userId", user.$id),
      ],
    });

    if (members.total === 0) {
      return c.json({documents:[], total: 0});
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.contains("$id", workspaceIds)
      ]
    );

    return c.json(workspaces);
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

      return c.json({ data: { ...workspace, uploadImageUrl } });
    }
  );

export default workspaces;
