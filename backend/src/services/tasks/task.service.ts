import prisma from '../../config/prisma';

interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  creatorId: string;
  assignedToId?: string | null;
}

interface UpdateTaskInput {
  taskId: string;
  userId: string; // logged-in user (from auth middleware)
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'TO_DO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  assignedToId?: string | null;
}

interface GetTasksInput {
  userId: string;
  status?: string;
  priority?: string;
  sort?: 'dueDate';
  order?: 'asc' | 'desc';
}

// Create a new task
export const createTask = async (data: CreateTaskInput) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      creatorId: data.creatorId,
      assignedToId: data.assignedToId ?? null,
    },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return task;
};

// Update task only creator OR assignee is allowed
export const updateTask = async (data: UpdateTaskInput) => {
  const { taskId, userId, ...updates } = data;

  if (Object.keys(updates).length === 0) {
    throw new Error('NO_FIELDS_TO_UPDATE');
  }

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new Error('TASK_NOT_FOUND');
  }

  if (
    existingTask.creatorId !== userId &&
    existingTask.assignedToId !== userId
  ) {
    throw new Error('FORBIDDEN');
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updates,
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedTask;
};

// Get task by ID
export const getTaskById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error('TASK_NOT_FOUND');
  }

  return task;
};

// Delete a task (creator only)
export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new Error('TASK_NOT_FOUND');
  }

  if (task.creatorId !== userId) {
    throw new Error('FORBIDDEN');
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};

// Dashboard data
export const getDashboardTasks = async (userId: string) => {
  const now = new Date();

  const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
    prisma.task.findMany({
      where: { assignedToId: userId },
    }),
    prisma.task.findMany({
      where: { creatorId: userId },
    }),
    prisma.task.findMany({
      where: {
        dueDate: { lt: now },
        status: { not: 'COMPLETED' },
        OR: [{ creatorId: userId }, { assignedToId: userId }],
      },
    }),
  ]);

  return {
    assignedTasks,
    createdTasks,
    overdueTasks,
  };
};

// Get all tasks based on filter
export const getTasks = async (input: GetTasksInput) => {
  const where: any = {
    OR: [{ creatorId: input.userId }, { assignedToId: input.userId }],
  };

  if (input.status) {
    where.status = input.status;
  }

  if (input.priority) {
    where.priority = input.priority;
  }

  const orderBy =
    input.sort === 'dueDate' ? { dueDate: input.order ?? 'asc' } : undefined;

  return prisma.task.findMany({
    where,
    orderBy,
    include: {
      creator: true,
      assignee: true,
    },
  });
};
