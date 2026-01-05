import { DATABASE_ID, WORKSPACES_ID } from "@/constants";
import { createSessionClient } from "@/lib/appwrite";
import {  Query } from "node-appwrite";

export const getWorkspaces = async () => {
  try {
   const {databases, account } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments({
      databaseId: DATABASE_ID,
      collectionId: "members",
      queries: [Query.equal("userId", user.$id)],
    });

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return workspaces;
  } catch {
    return { documents: [], total: 0 };
  }
};
