import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

export function refreshToken(req: Request, res: Response, next: NextFunction) {
    if (!JWT_SECRET) {
        return res.status(500).json({ message: "Internal server error" })
    }

    const accessToken = req.cookies.accessToken
    const refreshToken = req.cookies.refreshToken

    try {
        jwt.verify(accessToken, JWT_SECRET)
        return next()
    } catch (err) {
        if (!refreshToken) return res.sendStatus(401)

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

            res
                .cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
                .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
                .status(200)
                .json({ message: "Token refreshed" })

            return next()
        } catch (err) {
            return res.sendStatus(403)
        }
    }
}