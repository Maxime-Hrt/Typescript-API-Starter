import { Request, Response } from "express"
import * as authService from "../services/auth.service"

export async function signUp(req: Request, res: Response) {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Missing required fields' })
    return
  }

  try {
    const user = await authService.signUp(name, email, password)
    const { accessToken, refreshToken } = authService.generateTokens(user)

    res
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 }) // 15 minutes
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 }) // 30 days
      .status(201)
      .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    res.status(400).json({ message: (err as Error).message })
  }
}

export async function signIn(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await authService.signIn(email, password);
    const { accessToken, refreshToken } = authService.generateTokens(user);

    res
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 15 * 60 * 1000 })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 })
      .json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
}

export async function signOut(_: Request, res: Response) {
  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(204)
    .send()
}