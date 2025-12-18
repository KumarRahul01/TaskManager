import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),

  description: z.string(),
  dueDate: z.coerce.date({
    message: 'Invalid due date',
  }),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'], {
    message: 'Invalid priority',
  }),

  status: z.enum(['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']),

  assignedToId: z
    .uuid({
      message: 'Invalid assignee Id',
    })
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .optional(),

  description: z.string().optional(),

  dueDate: z.coerce
    .date({
      message: 'Invalid due date',
    })
    .optional(),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),

  status: z.enum(['TO_DO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']).optional(),

  assignedToId: z.uuid().nullable().optional(),
});

export const taskParamIdScehma = z.object({
  id: z.uuid({ message: 'Invalid task Id' }),
});
