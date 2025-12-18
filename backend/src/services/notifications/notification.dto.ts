import { z } from 'zod';

export const createNotificationSchema = z.object({
  userId: z.uuid(),
  type: z.enum(['TASK_ASSIGNED']),
  message: z.string().min(1),
  taskId: z.uuid().optional(),
});
