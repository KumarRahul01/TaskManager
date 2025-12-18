import { Request, Response, NextFunction } from 'express';
import { getMe, updateMe } from '../services/users/user.service';
import { updateProfileSchema } from '../services/users/user.dto';

export const handleGetMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getMe(req.user.id);

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateProfileSchema.parse(req.body);

    const user = await updateMe(req.user.id, data.name);

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
