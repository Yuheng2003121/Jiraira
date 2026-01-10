import z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  status: z.enum(TaskStatus, "status is required"),
  workspaceId: z.string().trim().min(1, "Workspace is required"),
  projectId: z.string().trim().min(1, "Project is required"),
  // dueDate: z.coerce.date(),
  // dueDate: z.date(),
  dueDate: z.string().datetime().nullable(),
  assigneeId: z.string().trim().min(1, "Assignee is required"),
  description: z.string().optional(),
});
