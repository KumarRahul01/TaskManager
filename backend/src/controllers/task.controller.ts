import { Request, Response, NextFunction } from 'express';
import {
  createTask,
  deleteTask,
  getDashboardTasks,
  getTaskById,
  getTasks,
  updateTask,
} from '../services/tasks/task.service';
import {
  createTaskSchema,
  taskParamIdScehma,
  updateTaskSchema,
} from '../services/tasks/task.dto';
import { getIO } from '../config/socket';

export const handleCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createTaskSchema.parse(req.body);

    const task = await createTask({
      ...data,
      creatorId: req.user.id,
    });

    const io = getIO();

    if (task.assignedToId) {
      io.to(task.assignedToId).emit('task:assigned', task);
    }

    io.emit('task:created', task);

    res.status(201).json({ staus: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const handleGetTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    taskParamIdScehma.parse(req.params);

    const task = await getTaskById(req.params.id);

    // Security check
    if (task.creator.id !== req.user.id && task.assignee?.id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.status(200).json({ staus: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await updateTask({
      ...data,
      taskId: req.params.id,
      userId: req.user.id,
    });

    const io = getIO();
    io.emit('task:updated', task);

    if (task.assignedToId) {
      io.to(task.assignedToId).emit('task:assigned', task);
    }

    return res.status(200).json({ status: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    taskParamIdScehma.parse(req.params);
    await deleteTask(req.params.id, req.user.id);

    const io = getIO();
    io.emit('task:deleted', { id: req.params.id });

    return res
      .status(202)
      .json({ status: true, message: 'Task deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

export const hanldeGetDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getDashboardTasks(req.user.id);
    return res.status(200).json({ staus: true, data });
  } catch (error) {
    next(error);
  }
};

export const handleGetTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await getTasks({
      userId: req.user.id,
      status: req.query.status as any,
      priority: req.query.priority as any,
      sort: req.query.sort as any,
      order: req.query.order as any,
    });

    return res.status(200).json({ status: true, data: tasks });
  } catch (error) {
    next(error);
  }
};
