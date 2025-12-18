import { Router } from 'express';
import { isAuthenticated } from '../middlewares/auth.middleware';
import {
  handleCreateTask,
  handleDeleteTask,
  handleGetTaskById,
  handleGetTasks,
  handleUpdateTask,
  hanldeGetDashboard,
} from '../controllers/task.controller';

const router = Router();

router.get('/', isAuthenticated, hanldeGetDashboard);
router.get('/get-tasks', isAuthenticated, handleGetTasks);
router.get('/:id', isAuthenticated, handleGetTaskById);
router.post('/create-task', isAuthenticated, handleCreateTask);
router.patch('/update-task/:id', isAuthenticated, handleUpdateTask);
router.delete('/delete-task/:id', isAuthenticated, handleDeleteTask);

export default router;
