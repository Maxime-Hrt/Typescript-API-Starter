import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { RequestWithMiddleware } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    if (!JWT_SECRET) {
        res.status(500).json({ message: "Internal server error" })
        return
    }

    const token = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any
        (req as RequestWithMiddleware).user = { id: payload.userId, role: payload.role }
        next()
    } catch (err) {
        const isExpired = err instanceof jwt.TokenExpiredError
        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token missing", expired: isExpired })
            return
        }

        try {
            const payload = jwt.verify(refreshToken, JWT_SECRET) as any

            const newAccessToken = jwt.sign(
                { userId: payload.userId, role: payload.role },
                JWT_SECRET,
                { expiresIn: '15m' }
            )

            const newRefreshToken = jwt.sign(
                { userId: payload.userId, role: payload.role },
                JWT_SECRET,
                { expiresIn: '30d' }
            )

            console.log("Refreshing token...")

            res
                .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
                .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

            // Inject user into request
            (req as any).user = { id: payload.userId, role: payload.role }

            return next()

        } catch (err) {
            res.sendStatus(403) // Forbidden
            return
        }
    }
}

export function authorizeRole(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
}
