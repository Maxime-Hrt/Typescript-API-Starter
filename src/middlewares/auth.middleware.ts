import { Response, Request, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { RequestWithMiddleware } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    if (!JWT_SECRET) {
        res.status(500).json({ message: "Internal server error" })
        return
    }

    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    try {
        const payload = jwt.verify(accessToken, JWT_SECRET) as any
        (req as RequestWithMiddleware).user = { id: payload.userId, role: payload.role }
        next()
    } catch (err) {
        // Only proceed with refresh if access token is expired
        if (!(err instanceof jwt.TokenExpiredError)) {
            res.status(401).json({ message: "Invalid token" })
            return
        }

        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token missing", expired: true })
            return
        }

        try {
            // Get expired access token payload without verification
            const expiredAccessPayload = jwt.decode(accessToken) as any
            if (!expiredAccessPayload) {
                res.status(401).json({ message: "Invalid access token" })
                return
            }

            const refreshPayload = jwt.verify(refreshToken, JWT_SECRET) as any

            // Verify the user IDs match between tokens
            if (expiredAccessPayload.userId !== refreshPayload.userId) {
                res.status(401).json({ message: "Token mismatch" })
                return
            }

            const newAccessToken = jwt.sign(
                { userId: refreshPayload.userId, role: refreshPayload.role },
                JWT_SECRET,
                { expiresIn: '15m' }
            )

            // Check if refresh token needs to be renewed (less than 7 days until expiration)
            const refreshTokenExp = (refreshPayload.exp * 1000) - Date.now() // Convert to milliseconds
            const sevenDays = 7 * 24 * 60 * 60 * 1000

            let newRefreshToken = refreshToken
            if (refreshTokenExp < sevenDays) {
                newRefreshToken = jwt.sign(
                    { userId: refreshPayload.userId, role: refreshPayload.role },
                    JWT_SECRET,
                    { expiresIn: '30d' }
                )
                console.log("Refreshing both tokens...")
            } else {
                console.log("Refreshing only access token...")
            }

            res
                .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
                .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

            // Inject user into request
            (req as RequestWithMiddleware).user = { id: refreshPayload.userId, role: refreshPayload.role }

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
