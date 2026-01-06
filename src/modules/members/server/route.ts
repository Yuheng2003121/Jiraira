import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { getMember } from "../utils";
import { DATABASE_ID } from "@/constants";
import { Query } from "node-appwrite";
import { MemberRole } from "../types";

const members = new Hono()
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
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });
      if (!member) {
        return c.json(
          {
            error:
              "Not a member of this workspace, You are not authorized to view this page",
          },
          401
        );
      }

      const members = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "members",
        queries: [Query.equal("workspaceId", workspaceId)],
      });

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        ...members,
        documents: populatedMembers,
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: "members",
      documentId: memberId,
    });

    if (!memberToDelete) {
      return c.json({ error: "Member not found" }, 404);
    }

    const allMembersInWorksapce = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: "members",
      queries: [Query.equal("workspaceId", memberToDelete.workspaceId)],
    });

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        { error: "You are not authorized to delete this member" },
        401
      );
    }

    if (member.userId === memberToDelete.userId) {
      return c.json(
        {
          error: "You cannot delete yourself",
        },
        400
      );
    }

    if (allMembersInWorksapce.total === 1) {
      return c.json(
        {
          error:
            "You cannot delete the last member of a workspace. Please transfer ownership to another member first.",
        },
        400
      );
    }

    await databases.deleteDocument({
      databaseId: DATABASE_ID,
      collectionId: "members",
      documentId: memberId,
    });

    return c.json(memberToDelete);
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        role: z.enum(MemberRole),
      })
    ),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument({
        databaseId: DATABASE_ID,
        collectionId: "members",
        documentId: memberId,
      });

      if (!memberToUpdate) {
        return c.json({ error: "Member not found" }, 404);
      }

      const allMembersInWorksapce = await databases.listDocuments({
        databaseId: DATABASE_ID,
        collectionId: "members",
        queries: [Query.equal("workspaceId", memberToUpdate.workspaceId)],
      });

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          { error: "You are not authorized to update this member" },
          401
        );
      }

      if (allMembersInWorksapce.total === 1) {
        return c.json(
          {
            error:
              "You cannot update the last member of a workspace. Please transfer ownership to another member first.",
          },
          400
        );
      }

      await databases.updateDocument({
        databaseId: DATABASE_ID,
        collectionId: "members",
        documentId: memberId,
        data: {
          role,
        },
      });

      return c.json(memberToUpdate);
    }
  );

export default members;
