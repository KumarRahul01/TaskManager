jest.mock('../../config/prisma', () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

import { createTask, updateTask } from './task.service';
import prisma from '../../config/prisma';

describe('Task Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a task successfully', async () => {
    (prisma.task.create as jest.Mock).mockResolvedValue({
      id: 'task-1',
      title: 'Test Task',
    });

    const task = await createTask({
      title: 'Test Task',
      description: 'Desc',
      dueDate: new Date(),
      priority: 'HIGH',
      status: 'TO_DO',
      creatorId: 'user-1',
    });

    expect(prisma.task.create).toHaveBeenCalled();
    expect(task.title).toBe('Test Task');
  });

  it('should allow creator to update task', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: 'task-1',
      creatorId: 'user-1',
    });

    (prisma.task.update as jest.Mock).mockResolvedValue({
      id: 'task-1',
      title: 'Updated Task',
    });

    const task = await updateTask({
      taskId: 'task-1',
      userId: 'user-1',
      title: 'Updated Task',
    });

    expect(prisma.task.update).toHaveBeenCalled();
    expect(task.title).toBe('Updated Task');
  });

  it('should throw error if non-creator updates task', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: 'task-1',
      creatorId: 'user-1',
    });

    await expect(
      updateTask({
        taskId: 'task-1',
        userId: 'user-2',
        title: 'Hack attempt',
      })
    ).rejects.toThrow('FORBIDDEN');
  });
});
