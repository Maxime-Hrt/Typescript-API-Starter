import { Request } from "express"

export type RequestWithMiddleware = Request & { user: { id: string, role: string } }