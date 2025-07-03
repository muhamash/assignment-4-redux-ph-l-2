import { Request } from "express";

export interface AuthenticatedRequest<
  P = { id: string },  
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: { id: string };
}