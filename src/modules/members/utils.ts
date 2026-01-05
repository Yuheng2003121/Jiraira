import { DATABASE_ID } from '@/constants';
import { Databases, Query } from 'node-appwrite';
interface GetMemberProps {
  databases: Databases;
  workspaceId: string;
  userId: string;
}
export const getMember = async ({ databases, workspaceId, userId }: GetMemberProps) => {
  const members = await databases.listDocuments({
    databaseId: DATABASE_ID,
    collectionId: "members",
    queries: [
      Query.equal("workspaceId", workspaceId),
      Query.equal("userId", userId),
    ]
  })

  return members.documents[0];
}