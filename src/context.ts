import { Request, Response } from 'express';
import { JwtService } from './core/jwt/jwt.service';

export interface ServerContext {
  id: string;
}

export interface ContextParameters {
  req: Request;
  res: Response;
}

export const context = async ({ req }: ContextParameters): Promise<ServerContext> => {
  try {
    const token = req?.headers?.authorization;
    const jwtService = new JwtService();
    const data = token && jwtService.verifyToken(token);
    return {
      id: data['data']?.id,
    };
  } catch (error) {
    console.log(`Error on context:`, error);
    return {
      id: null,
    };
  }
};
