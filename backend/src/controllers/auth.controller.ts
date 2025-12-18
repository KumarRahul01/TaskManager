import { NextFunction, Request, Response } from 'express';
import { registerSchema, loginSchema } from '../services/auth/auth.dto';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../services/auth/auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data.name, data.email, data.password);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = loginSchema.parse(req.body);

    const { user, token } = await loginUser(data.email, data.password);

    // Save Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  await logoutUser();
  res.status(200).json({
    message: 'Logged out successfully',
  });
};
