import { ServerContext } from '@server/context';
import { sign, verify } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class JwtService {
  generateToken = (id: string, rememberMe?: boolean): string => {
    const token = sign({ data: { id: id } }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? process.env.JWT_REMEMBER_ME_EXPIRATION : process.env.JWT_EXPIRATION,
    });
    return `Bearer ${token}`;
  };

  verifyToken = (token: string) => {
    const decoded = verify(token.split(' ')[1], process.env.JWT_SECRET) as {
      iat: string;
      exp: string;
      data: ServerContext;
    };
    return decoded;
  };
}
