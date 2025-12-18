import prisma from '../../config/prisma';
import { createNotificationSchema } from './notification.dto';

interface CreateNotificationInput {
  userId: string;
  type: 'TASK_ASSIGNED';
  message: string;
  taskId?: string;
}

export const createNotification = async (input: CreateNotificationInput) => {
  const data = createNotificationSchema.parse(input);
  return prisma.notification.create({
    data,
  });
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
